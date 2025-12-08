import { createRouter, createWebHistory } from 'vue-router'
import { authorized } from '@/common/auth/authorized.js'
import { loggedIn } from '@/common/auth/guard.js'
import { PERMISSION_NAME } from '@/constants/index.js'
import authRoutes from './auth.js'
import regulatorRoutes from './regulator.js'
import reportRoutes from './report.js'
import userRoutes from './user.js'

const routes = [
  ...authRoutes,
  {
    path: '/',
    component: () => import('@/common/views/AppLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: { permission: PERMISSION_NAME.DASHBOARD },
        component: () => import('@/views/HomeView.vue'),
      },
      ...reportRoutes,
      ...regulatorRoutes,
      ...userRoutes,
    ],
    meta: { isSecure: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/common/views/PageNotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { redirectLogin } = await loggedIn(to, next)

  if (!redirectLogin) {
    authorized(to, next, router)
  }
})

export default router
