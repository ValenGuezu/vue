import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/agente/:id', component: personajes, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router