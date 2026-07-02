import MainLayout from '@/layouts/MainLayout.vue'
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: { layout: MainLayout }
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
})

export default router
