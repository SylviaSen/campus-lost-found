import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Publish from '../views/Publish.vue'
import Detail from '../views/Detail.vue'
import Mine from '../views/Mine.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/publish', component: Publish },
  { path: '/detail/:id', component: Detail },
  { path: '/mine', component: Mine },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router