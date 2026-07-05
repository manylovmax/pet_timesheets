import axios from 'axios';
import MainLayout from '@/layouts/MainLayout.vue';
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue';
import HomePage from '@/pages/HomePage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/services/auth.service';
import config from '@/constants';
import SigninPage from '@/pages/SigninPage.vue';
import SignupPage from '@/pages/SignupPage.vue';

const authService = new AuthService();

async function isAuthethicated(): Promise<boolean> {
  return await authService.verify();
}


async function authGuard() {
  if (!await isAuthethicated()) return '/signin';
}

const routes = [
  {
    path: '/records',
    component: HomePage,
    meta: { layout: MainLayout },
    beforeEnter: [authGuard]
  },
  {
    path: '/signin',
    component: SigninPage,
    meta: { layout: UnauthorizedLayout }
  },
  {
    path: '/signup',
    component: SignupPage,
    meta: { layout: UnauthorizedLayout }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
