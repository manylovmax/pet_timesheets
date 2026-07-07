import axios from 'axios';
import MainLayout from '@/layouts/MainLayout.vue';
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/services/auth.service';
import SigninPage from '@/pages/SigninPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import RecordsPage from '@/pages/RecordsPage.vue';
import RecordUpdate from '@/pages/RecordUpdate.vue';

const authService = new AuthService();

async function isAuthethicated(): Promise<boolean> {
  return await authService.verify();
}


async function authGuard() {
  if (!await isAuthethicated()) return '/signin';
}

const routes = [
  {
    path: '/',
    redirect: '/records',
  },
  {
    path: '/records',
    component: RecordsPage,
    meta: { layout: MainLayout },
    beforeEnter: [authGuard]
  },
  {
    path: '/record-update',
    component: RecordUpdate,
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
  {
    path: '/:pathMatch(.*)',
    redirect: '/records',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
