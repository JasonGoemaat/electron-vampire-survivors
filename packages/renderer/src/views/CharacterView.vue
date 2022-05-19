<template>
  <div class="column">
    <h3>Character: {{ name }}</h3>
    <p v-if="name === 'DEFAULT'" >
      The defaults here will be applied to all characters.   This would be useful
      if you want to make all characters faster or luckier for instance.  Individual
      values will be overwritten by individual character mods.
    </p>
    <p v-if="name !== 'DEFAULT'" >
      {{ character.stats.description }}
    </p>

    <table>
      <thead>
        <th>stat</th>
        <th>character value</th>
        <th>previous</th>
        <th>override</th>
      </thead>
      <tbody>
        <tr>
          <td>luck</td>
          <td class="monospace">{{ getStat('luck') }}</td>
          <td class="monospace">{{ mod.luck }}</td>
          <td><input v-model="luck" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>maxHp</td>
          <td class="monospace">{{ getStat('maxHp') }}</td>
          <td class="monospace">{{ mod.maxHp }}</td>
          <td><input v-model="maxHp" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>armor</td>
          <td class="monospace">{{ getStat('armor') }}</td>
          <td class="monospace">{{ mod.armor }}</td>
          <td><input v-model="armor" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>regen</td>
          <td class="monospace">{{ getStat('regen') }}</td>
          <td class="monospace">{{ mod.regen }}</td>
          <td><input v-model="regen" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>moveSpeed</td>
          <td class="monospace">{{ getStat('moveSpeed') }}</td>
          <td class="monospace">{{ mod.moveSpeed }}</td>
          <td><input v-model="moveSpeed" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>power</td>
          <td class="monospace">{{ getStat('power') }}</td>
          <td class="monospace">{{ mod.power }}</td>
          <td><input v-model="power" placeholder="default" class="monospace"></td>
        </tr>
        <tr>
          <td>magnet</td>
          <td class="monospace">{{ getStat('magnet') }}</td>
          <td class="monospace">{{ mod.magnet }}</td>
          <td><input v-model="magnet" placeholder="default" class="monospace"></td>
        </tr>
      </tbody>
    </table>

    <p>
      <a class="button-link" @click="clearAll">clear all</a> &nbsp;-&nbsp;
      <a class="button-link" @click="update">update</a> &nbsp;-&nbsp;
      <a class="button-link" @click="cancel">cancel</a>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { useMainStore, GameStates } from "../store/main";
import { BundleCharacter } from "../services/ParserService";
import { CharacterMod } from '../models/Config';

const mainStore = useMainStore();
const route = useRoute();
const name = `${route.params.name}`;
const DEFAULT_CHARACTER: BundleCharacter = {
  name: 'DEFAULT',
  start: 0,
  end: 0,
  stats: {},
  positions: {}
}

const character = mainStore.characters.find(x => x.name === name) || DEFAULT_CHARACTER;
const mod = mainStore.getCharacterMod(name);

(window as any).character = character;
(window as any).mainStore = mainStore;

console.log('route params:', route.params);

const getStat = (statName: string) => {
  if (name === 'DEFAULT') {
    return 'N/A';
  }
  return character.stats[statName];
}

const clearAll = () => {
  luck.value = '';
  maxHp.value = '';
  armor.value = '';
  regen.value = '';
  moveSpeed.value = '';
  power.value = '';
  magnet.value = '';
}

const addIfPresent = (mod: CharacterMod, name: string, value: string | undefined) => {
  if (value && value.length > 0) {
    (mod as any)[name] = value;
  } else {
    delete (mod as any)[name];
  }
}

let luck = ref(mod.luck);
let maxHp = ref(mod.maxHp);
let armor = ref(mod.armor);
let regen = ref(mod.regen);
let moveSpeed = ref(mod.moveSpeed);
let power = ref(mod.power);
let magnet = ref(mod.magnet);

const update = () => {
  const newMod: CharacterMod = {};
  addIfPresent(newMod, 'luck', luck.value);
  addIfPresent(newMod, 'maxHp', maxHp.value);
  addIfPresent(newMod, 'armor', armor.value);
  addIfPresent(newMod, 'regen', regen.value);
  addIfPresent(newMod, 'moveSpeed', moveSpeed.value);
  addIfPresent(newMod, 'power', power.value);
  addIfPresent(newMod, 'magnet', magnet.value);
  mainStore.setCharacterMod(name, newMod);
}

const router = useRouter();

if (mainStore.state !== GameStates.Initialized) {
  router.push('/');
}

const cancel = () => {
  router.push('/');
}
</script>

<style lang="scss">
table {
  border-collapse: collapse;
  th,td {
    border: solid 1px gray;
    padding: 0.2em 1em;
  }
}

.monospace {
  font-family:'Consolas', 'Courier New', Courier, monospace;
}
</style>