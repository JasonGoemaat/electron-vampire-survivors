<template>
  <h1>Test Reactive Array</h1>
  <div v-for="stat in statsRef" :key="stat.name">
    Stat: {{ stat.name }}, Index: {{ stat.index }}, Value: {{ stat.value }}<br/>
    <input v-model="stat.value" >
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue';

let stats = 'luck,strength'.split(',').map((name, i) => {
  return {
    name,
    index: i,
    value: 1337,
    valueRef: ref(1337)
  }
});

let statsRef = ref(stats);
</script>

<style lang="scss">
div { margin-bottom: 1em; }
</style>