<template>
  <div>
    <input type="text" v-model="value" />
    <p>Value: {{ value }}</p>
  </div>
</template>

<!-- <script lang="ts">
  export default {
    data() {
      return {
        value: 'Hello World'
      }
    }
  }
</script> -->

<script lang="ts" setup>
import { ref } from 'vue';

let value = ref("Hello World");
(window as any).refValue = value;
</script>
