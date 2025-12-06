import { defineStore } from 'pinia'
import http from '@/utils/http.js'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: { token: null, data: null, roles: [], permissions: [] },
    }
  },
  actions: {
    async login (email, password) {
      const { data } = await http.post('auth/login', { email, password })
      this.user.token = data.token
      this.user.data = data.user
      this.user.roles = data.roles
      this.user.permissions = data.permissions

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    async sendResetPassword (email) {
      const { data } = await http.post('/auth/send-reset-password', { email })
      this.success = data.message
      return data
    },
    async verifyResetPassword (token) {
      await http.post('/auth/verify-reset-password', { token })
    },
    async resetPassword (token, password) {
      const { data } = await http.post('/auth/reset-password', { token, password })
      this.success = data.message
      return data
    },
    disconnect () {
      this.user = { token: null, data: null, roles: [], permissions: [] }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    async getUser () {
      const { data } = await http.get('auth/whoami')

      this.user.data = data.user
      this.user.roles = data.roles
      this.user.permissions = data.permissions
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    setToken (newToken) {
      this.user.token = newToken
    },
  },
})
