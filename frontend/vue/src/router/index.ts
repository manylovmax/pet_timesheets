import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/services/auth.service';
import SigninPage from '@/pages/SigninPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import RecordsPage from '@/pages/RecordsPage.vue';
import RecordUpdate from '@/pages/RecordUpdate.vue';
import RecordCreate from '@/pages/RecordCreate.vue';
import TimetablePage from '@/pages/TimetablePage.vue';
import ProjectsPage from '@/pages/ProjectsPage.vue';
import ProjectCreate from '@/pages/ProjectCreate.vue';
import ProjectUpdate from '@/pages/ProjectUpdate.vue';

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
    redirect: '/timetable',
  },
  {
    path: '/records',
    component: RecordsPage,
    beforeEnter: [authGuard]
  },
  {
    path: '/record-update/:id',
    component: RecordUpdate,
    beforeEnter: [authGuard]
  },
  {
    path: '/record-create',
    component: RecordCreate,
    beforeEnter: [authGuard]
  },
  {
    path: '/signin',
    component: SigninPage,
  },
  {
    path: '/signup',
    component: SignupPage,
  },
  {
    path: '/timetable',
    component: TimetablePage,
    beforeEnter: [authGuard]
  },
  {
    path: '/projects',
    component: ProjectsPage,
    beforeEnter: [authGuard]
  },
  {
    path: '/project/create',
    component: ProjectCreate,
    beforeEnter: [authGuard]
  },
  {
    path: '/project/:id/update',
    component: ProjectUpdate,
    beforeEnter: [authGuard]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/timetable',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router
