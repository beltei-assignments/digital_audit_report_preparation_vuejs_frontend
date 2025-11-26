import { defineStore } from 'pinia'
import http from '@/utils/http'

export const useRegulatorStore = defineStore('regulator', {
  state: () => ({
    regulators: [],
  }),
  actions: {
    async fetchRegulators (params) {
      const { data } = await http.get('/crud/regulators', { params })

      this.regulators = data.rows

      return data
    },
    async createRegulator (payload) {
      await http.post('/crud/regulators', payload)
    },
    async updateRegulator (id, payload) {
      await http.put(`/crud/regulators/${id}`, payload)
    },
    async deleteRegulator (id) {
      await http.delete(`/crud/regulators/${id}`)
    },
  },
})
