# Setup

I used [this github template](https://github.com/electron-vite/electron-vite-vue).  
Clicking 'Use this template' let me create a repo based on it.

## Add Pinia

Check out [pinia.md](pinia.md)

## Add VUE Devtools

First install an extension that will install it:

    yarn add -D electron-devtools-installer

Add command to install devtools in development in `packages/main/index.ts`:

```ts
import installExtension from 'electron-devtools-installer'

const installDevtools = async () => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await installExtension('nhdogjmejiglipccpnnnanhbledajbpd')
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
}

// added installDevtools step
app.whenReady().then(installDevtools).then(createWindow);
```

## Add Routing

Ran `yarn add -D vue-router`

Added `packages/renderer/src/router/index.ts` which uses `require('cue-router').createRouter()`
and configures routes.

Updated `packages/renderer/src/main.ts` to use router:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import router from './router' // added this
import { createPinia } from 'pinia'

createApp(App)
  .use(createPinia())
  .use(router) // added this
  .mount('#app')
  .$nextTick(window.removeLoading)
```

Of course I added some routes into `packages/renderer/src/views` that are loaded
into the `router/index.ts` script and updated `App.vue` to include the
`router-view` and a small nav to link to the routes and removed the other code:

```vue
<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/counter">Counter</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
</template>
```