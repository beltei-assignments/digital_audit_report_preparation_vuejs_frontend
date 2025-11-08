export default [
  {
    path: '/login',
    name: 'Login',
    meta: { isLogin: true, auth: true },
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/forgot_password',
    name: 'ForgotPasswordView',
    meta: { auth: true },
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
  },
  {
    path: '/reset_password/:token',
    name: 'ResetPasswordView',
    meta: { auth: true },
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    props: true,
  },
]
