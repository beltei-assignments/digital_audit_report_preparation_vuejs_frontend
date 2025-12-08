export default [
  {
    path: '/login',
    name: 'Login',
    meta: { isLogin: true, auth: true },
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    meta: { auth: true },
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
  },
  {
    path: '/change-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    props: true,
  },
]
