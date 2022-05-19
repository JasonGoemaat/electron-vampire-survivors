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
import { writeFileSync } from 'original-fs';
import { useMainStore, GameStates } from '../store/main'

const mainStore = useMainStore();

(window as any).mainStore = mainStore;

const initialize = async () => {
  console.log('you clicked initialize!');
  const result = await mainStore.initialize();
  console.log('done with HomeView.initialize()');
  console.log('result:', result);
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

const applyCharacterMods = async () => {

}

const applyModifications = async () => {

}

const useBackup = async () => {
  if (!(mainStore.backup && mainStore.bundle)) {
    alert('error!');
    return;
  }

  mainStore.saveBundle(mainStore.backup.contents)
}
</script>