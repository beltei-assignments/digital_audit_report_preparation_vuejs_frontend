const prefix = '/regulator'

export default [
  {
    path: `${prefix}`,
    name: 'RegulatorHome',
    component: () => import('@/views/regulator/RegulatorHome.vue'),
  },
]
