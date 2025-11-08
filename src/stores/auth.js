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
    disconnect () {
      this.user = { token: null, data: null, roles: [], permissions: [] }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    async getUser () {
      const { data } = await http.get('auth/whoami')

      this.user.token = data.token
      this.user.data = data.user
      this.user.roles = data.roles
      this.user.permissions = data.permissions
      localStorage.setItem('user', JSON.stringify(this.user))
    },
  },
})
