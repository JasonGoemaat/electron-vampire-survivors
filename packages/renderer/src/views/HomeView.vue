<template>
<div class="column">
  <h1>Vampire Survivors</h1>
  <img src="../assets/GameLogo.png" />
  
  <h3 v-if="mainStore.state == GameStates.Start">Initializing...</h3>
  
  <p v-if="mainStore.state == GameStates.Error">
    <span class="error">Error:</span> {{ mainStore.error }}
  </p>
  
  <div v-if="mainStore.state === GameStates.HashMismatch">
  <h3>Hash Mismatch</h3>
    <p>Current Bundle Hash: {{ mainStore.bundle?.md5 }}</p>
    <p>Last Saved Hash: {{ mainStore.config.lastSavedMd5 }}</p>
    <p>
      If the game has been patched or you have made modifications directly
      to main.bundle.js that you wish to be used as the base for further modifications,
      <a class="button-link" @click="useCurrentBundle()">click here</a>
      to copy the current bundle as the new base for applying mods.
    </p>
    <p>
      If you wish to wish to continue to use the existing saved backup
      of main.bundle.js as the base for modifications,
      <a class="button-link" @click="updateLastSavedHash()">click here</a>
      to record the hash so you won't see this message again.
    </p>
  </div>

  <div v-if="mainStore.state == GameStates.NeedBackup">
    <h3>Backup Required</h3>
    <p>
      Your game directory has been found, the first step is to create
      a backup in your user data directory.   When we apply cheats it
      will use the backup file along with the cheats you select.
      We were unable to create a backup file.  Check that the paths exist:
    </p>
    <p><strong>Main bundle:</strong> {{ mainStore.mainSettings?.bundlePath }} </p>
    <p><strong>Backup:</strong> {{ mainStore.mainSettings?.backupPath }} </p>
  </div>
  <p v-if="mainStore.state == GameStates.Initialized">
    <h3>Characters</h3>
    <router-link :to="{ name: 'character', params: { name: 'DEFAULT' }}">DEFAULT</router-link>
    <span v-for="character in mainStore.characters" v-bind:key="character.name">
      | <router-link :to="{ name: 'character', params: { name: character.name }}">{{ character.name }}</router-link>
    </span>
  </p>

  <h4><a class="button-link" @click="applyModifications">Apply Modifications</a></h4>
  <h4><a class="button-link" @click="useBackup">Use Backup</a></h4>
</div>
</template>

<script lang="ts" setup>
import { useMainStore, GameStates } from '../store/main'
import { CharacterMod } from '../models/Config'
import { ParsedBundle, BundleCharacter} from '../services/ParserService'

const mainStore = useMainStore();

(window as any).mainStore = mainStore;

const initialize = async () => {
  const result = await mainStore.initialize();
}

if (mainStore.state == GameStates.Start) {
  initialize().then(() => console.log('Initialized!'));
}

const useCurrentBundle = async () => {
  mainStore.updateBackup()
}

const updateLastSavedHash = async () => {
  mainStore.config.lastSavedMd5 = mainStore.bundle?.md5 || '';
  mainStore.saveConfig();
}

interface Patch {
  start: number,
  end: number,
  value: string
}

const applyCharacterMods = (contents: string): Patch[] => {
  if (!(mainStore.parsed && mainStore.parsed.characters)) throw new Error("No parsed characters");
  const patches: Patch[] = [];
  const characterMods = mainStore.config.characterMods;

  const apply = (character: BundleCharacter, mod: CharacterMod) => {
    if (!mod) return;
    const keys = Object.keys(mod);
    keys.forEach(key => {
      const value = mod[key];
      if (typeof(value) === 'string') {
        let start = character.positions[key].startValue;
        let end = character.positions[key].endValue;
        if (start >= character.start && start < character.end && end >= character.start && end < character.end) {
          patches.push({
            start,
            end,
            value
          });
        }
      }
    });
  }

  (mainStore.parsed as ParsedBundle).characters.forEach(character => {
    const mods = Object.assign({}, characterMods['DEFAULT'], characterMods[character.name]);
    apply(character, mods)
  })

  return patches;
}

const applyModifications = async () => {
  if (!mainStore.backup) {
    alert('error!');
    return;
  }

  // apply character mods
  let patches: Patch[] = [];
  let contents = mainStore.backup.contents;
  patches = [...patches, ...applyCharacterMods(contents)];
  
  // write updated bundle
  var newContents = applyPatches(contents, patches);
  mainStore.saveBundle(newContents);
  alert("Bundle updated, have fun!");
}

const applyPatches = (contents: string, patches: Patch[]): string => {
  const list = patches.sort((a, b) => a.start - b.start);
  console.log('list:', list);
  for (let i = 1; i < list.length; i++) {
    if (list[i].start < list[i-1].end) throw new Error("Overlapping patches!");
  }

  const parts: string[] = [];
  let pos = 0;
  list.forEach(patch => {
    parts.push(contents.substring(pos, patch.start));
    parts.push(patch.value);
    pos = patch.end;
  });
  parts.push(contents.substring(pos));
  const newContents = parts.join('');

  let offset = 0;
  for(let i = 0; i < list.length; i++) {
    const patch = list[i];
    const start = patch.start + offset - 5;
    const end = patch.end + offset + 5;
    console.log(`Patching <${contents.substring(patch.start - 5, patch.end + 5)}> to <${newContents.substring(start, end)}>`);
    offset += patch.value.length - (patch.end - patch.start);
  }
  return newContents;
}

const useBackup = async () => {
  if (!(mainStore.backup && mainStore.bundle)) {
    alert('error!');
    return;
  }

  mainStore.saveBundle(mainStore.backup.contents)
  await mainStore.initialize();
}
</script>