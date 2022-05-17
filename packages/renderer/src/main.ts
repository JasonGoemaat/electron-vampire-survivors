import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import { createPinia } from 'pinia'

createApp(App)
  .use(createPinia())
  .mount('#app')
  .$nextTick(window.removeLoading)
