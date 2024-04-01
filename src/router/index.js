import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/pages/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/pages/LoginView.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('@/components/pages/SignUpView.vue')
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/components/pages/ReportView.vue')
    }
  ]
})

export default router
