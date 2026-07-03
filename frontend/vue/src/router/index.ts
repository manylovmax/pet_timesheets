import axios from 'axios';
import MainLayout from '@/layouts/MainLayout.vue';
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import { createRouter, createWebHistory, type RouteLocationMatched } from 'vue-router';

async function isAuthethicated(): Promise<boolean> {
  
}


async function authGuard() {
  if (!await isAuthethicated()) return '/login';
}

const routes = [
  {
    path: '/records',
    component: HomePage,
    meta: { layout: MainLayout },
    beforeEnter: [authGuard]
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { layout: UnauthorizedLayout }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
