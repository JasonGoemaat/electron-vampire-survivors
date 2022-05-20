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
        <tr v-for="stat in statsRef" v-bind:key="stat.name">
          <td>{{ stat.name }}</td>
          <td class="monospace">{{ getCharacterStat(stat.name) }}</td>
          <td class="monospace">{{ mod[stat.name] }}</td>
          <td>
            <input 
              v-model="stat.value"
              placeholder="default"
              class="monospace">
              <br/>
          </td>
        </tr>
      </tbody>
    </table>

    <p>
      <a class="button-link" @click="clearAll">clear all</a> &nbsp;-&nbsp;
      <a class="button-link" @click="update">update</a> &nbsp;-&nbsp;
      <a class="button-link" @click="cancel">cancel</a>
    </p>
  </div>

  {{ JSON.stringify(stats[0]) }}
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
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

(window as any).mainStore = mainStore;
(window as any).character = character;
(window as any).mod = mod;

const getCharacterStat = (name: string) => {
  if (name === 'DEFAULT') {
    return 'N/A';
  }
  return character.stats[name];
}

const statNames = 'luck,maxHp,armor,regen,moveSpeed,power,magnet,cooldown,area,speed,duration,amount,growth,greed,curse,revivals,rerolls,skips,banish'.split(',');
const stats = statNames.map(name => ({ name, value: mod[name] }));
const statsRef = ref(stats);

const clearAll = () => {
  console.log('clearAll()!');
  statsRef.value.forEach(stat => stat.value = "");
}

const addIfPresent = (mod: CharacterMod, name: string, value: string | undefined) => {
  if (value && value.length > 0) {
    (mod as any)[name] = value;
  } else {
    delete (mod as any)[name];
  }
}

const update = () => {
  const newMod: CharacterMod = {};

  stats.forEach((stat) => {
    addIfPresent(newMod, stat.name, stat.value);
  })

  mainStore.setCharacterMod(name, newMod);
  router.push('/');
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