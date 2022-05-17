<script lang="ts" setup>
import { useCounterStore } from '../store/counter';

const counter = useCounterStore();
</script>

<template>
  <h1>Counter: {{ counter.counter }}</h1>
  <button @click="counter.increment()">Increment</button>
  &nbsp;
  <button @click="counter.reset()">Reset</button>
</template>
