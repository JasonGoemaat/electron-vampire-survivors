import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
    component: () => import('../views/CounterView.vue') // lazy import code splitting
  },
  {
    path: '/sample-file',
    name: 'sample-file',
    component: SampleFileView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue') // lazy importing code cplitting
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
