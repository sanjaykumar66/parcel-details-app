import { createRouter, createWebHistory } from 'vue-router'

import { auth } from './config/firebaseConfig'

const routes = [
  { path: '/', component: () => import('./pages/LoginPage.vue') },
  { path: '/dashboard', component: () => import('./pages/DashboardPage.vue') , meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.currentUser) {
    next('/'); 
  }
  else{
    next()
  }
})

export default router