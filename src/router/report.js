const prefix = '/report'

export default [
  {
    path: `${prefix}/:type`,
    name: 'ReportHome',
    component: () => import('@/views/report/ReportHome.vue'),
  },
  {
    path: `${prefix}/:type/create`,
    name: 'ReportCreate',
    component: () => import('@/views/report/ReportCreate.vue'),
  },
  {
    path: `${prefix}/:type/:id/edit`,
    name: 'ReportEdit',
    component: () => import('@/views/report/ReportEdit.vue'),
  },
]
