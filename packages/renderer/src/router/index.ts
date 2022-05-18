import { createRouter, createWebHashHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import HomeView from '../views/HomeView.vue'
import CounterView from '../views/CounterView.vue'
import SampleFileView from '../views/SampleFileView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/counter',
    name: 'counter',
    component: CounterView
  },
  {
    path: '/sample-file',
    name: 'sample-file',
    component: SampleFileView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
