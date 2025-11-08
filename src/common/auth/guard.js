import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores'

export async function isUserLogin () {
  const { user } = storeToRefs(useAuthStore())
  let isLogin = false
  let isRefresh = false

  const token = localStorage.getItem('token')
  if (!token) {
    return { login: isLogin }
  }
  if (token && !user.value.token) {
    user.value.token = token
    isRefresh = true
  }
  isLogin = true
  return { login: isLogin, isRefresh }
}

export const loggedIn = async (to, next) => {
  const { getUser } = useAuthStore()
  const { login, isRefresh } = await isUserLogin()

  if (!login && to.matched[0].meta.isSecure) {
    next({ name: 'Login' })

    return { redirectLogin: true }
  } else if (login && to.meta.auth) {
    next({ name: 'Home' })

    return { redirectLogin: true }
  } else {
    if (login && isRefresh) {
      await getUser()
    }

    return { redirectLogin: false }
  }
}
