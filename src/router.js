import { createWebHistory, createRouter } from 'vue-router'
import Home from './page/Home.vue';
import Login from './page/Login.vue';
import Register from './page/Register.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})