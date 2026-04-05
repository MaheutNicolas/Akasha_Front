import { createWebHistory, createRouter } from 'vue-router'
import Home from './page/Home.vue';
import Login from './page/Login.vue';
import Register from './page/Register.vue';
import Rune from './page/Rune.vue';
import Game from './page/Game.vue';
import Email from './page/Email.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/rune', component: Rune },
  { path: '/game', component: Game },
  { path: '/mail', component: Email }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})