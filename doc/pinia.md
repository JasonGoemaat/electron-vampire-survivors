# Pinia

First I did `yarn add pinnia` to add it to the project.  I will create
a simple counter component with actions for updating to try it out.

First I'll update 'renderer/src/main.ts` to use pinia:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia } from 'pinia' // added

createApp(App)
  .use(createPinia()) // added
  .mount('#app')
  .$nextTick(window.removeLoading)
```

I'll create a 'counter' store in 'renderer/src/store/counter.ts'

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: state => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++;
    },
    reset() {
      this.counter = 0;
    }
  }
})
```

I'll add a new simple counter component to display the count
and allow incrementing and resetting:

```vue
<script lang="ts">
import { useCounterStore } from '../store/counter';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const counter = useCounterStore();

    return ({
      counter
    })
  }
})
</script>

<template>
  <h1>Counter: {{ counter.counter }}</h1>
  <button @click="counter.increment()">Increment</button>
  &nbsp;
  <button @click="counter.reset()">Reset</button>
</template>
```

A few things of note:

1. the script tag as `lang="ts"`, because the template uses typescript, nice!

Interestingly we could use the `setup` attribute on the script element,
which automatically returns any local values created in the script
for use in the component:

```ts
<script lang="ts" setup>
import { useCounterStore } from '../store/counter';

const counter = useCounterStore();
</script>
```
