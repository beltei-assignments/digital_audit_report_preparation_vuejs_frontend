import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/lib/state/loading/loading'
import { useAuthStore } from '@/stores'

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/rest/api/'
const http = axios.create({
  baseURL: BASE_URL,
})

http.interceptors.request.use(config => {
  const { isLoading } = storeToRefs(useLoadingStore())
  isLoading.value = true
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-access-token'] = token
  }
  config.headers['Content-Type'] = 'application/json'
  return config
})

http.interceptors.response.use(
  response => {
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false
    return response
  },
  async error => {
    const { disconnect } = useAuthStore()
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false

    if ([401].includes(error.request.status) && !['auth/login'].includes(error.config.url)) {
      disconnect()

      // DEV: hard reload to redirct to login
      window.location.href = '/login'
    }

    throw error
  },
)

export default http
