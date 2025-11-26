const prefix = '/report'

export default [
  {
    path: `${prefix}/draft`,
    name: 'ReportDraft',
    component: () => import('@/views/report/DraftReportHome.vue'),
  },
//   {
//     path: `${prefix}/preliminary`,
//     name: 'ReportPreliminary',
//     component: () => import('@/views/...to report'),
//   },
]
