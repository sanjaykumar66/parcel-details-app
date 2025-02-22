import { createRouter, createWebHistory } from 'vue-router'

import { auth } from './config/firebaseConfig'

const routes = [
  { path: '/', name: 'login', component: () => import('./pages/LoginPage.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('./pages/DashboardPage.vue') , meta: { requiresAuth: true } },
  { path: '/upload', name: 'upload', component: () => import('./components/FileUploader.vue') , meta: { requiresAuth: true } },
  // { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _ , next) => {
  if (to.meta.requiresAuth && !auth.currentUser?.uid) {
    router.push({ name: 'login' })
  }
  else{
    next()
  }
})

export default router