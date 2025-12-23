import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useReportStore = defineStore('report', {
  state: () => ({
    count_statuses: {},
    reports: [],
    count_risks: {},
    alerts: [],
  }),
  actions: {
    async fetchReports (params) {
      const { data } = await http.get('/reports', { params })
      this.reports = data.rows

      return data
    },
    async getById (id) {
      const { data } = await http.get(`/reports/${id}`)

      return data
    },
    async countStatus (params) {
      const { data } = await http.get('/reports/count-status', { params })
      this.count_statuses = data

      return data
    },
    async generateNotifications (params) {
      const { data } = await http.get('/reports/generate-notifications', { params })
      this.count_risks = data.count_risks
      this.alerts = data.alerts

      return data
    },
    async createReport (payload) {
      return http.post('/reports', payload)
    },
    async updateReport (id, payload) {
      await http.put(`/reports/${id}`, payload)
    },
    async sendRequest (id, payload) {
      await http.put(`/reports/${id}/send-request`, payload)
    },
    async deleteReport (id) {
      await http.delete(`/reports/${id}`)
    },
    async exportPDF ({ html, filename }) {
      const res = await http.post('/export/pdf', { html, filename }, { responseType: 'blob' })
      return res.data
    },
  },
})
