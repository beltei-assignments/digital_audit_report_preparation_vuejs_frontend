<template>
  <v-row class="h-screen" no-gutters>
    <v-col class="d-flex justify-center align-center" cols="6">
      <v-form ref="form" class="w-50">
        <h1>{{ isChangePasswordPage ? 'Change new password' : $t('auth.resetPassword.title') }}</h1>
        <p>Reset new password for <span class="text-primary">{{ showEmail }}</span></p>

        <v-text-field
          v-if="isChangePasswordPage"
          v-model="currentPassword"
          :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black placeholder-capitalize mt-4"
          density="compact"
          name="password"
          placeholder="Current password"
          prepend-inner-icon="mdi-lock-open-outline"
          :rules="[FORM_RULES.required]"
          :type="showCurrent ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="showCurrent = !showCurrent"
        />

        <v-text-field
          v-model="credential.password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black placeholder-capitalize mt-4"
          density="compact"
          name="password"
          :placeholder="$t('auth.resetPassword.newPassword')"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[FORM_RULES.required]"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-text-field
          v-model="credential.confirmPassword"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black placeholder-capitalize mt-4"
          density="compact"
          name="password"
          :placeholder="$t('auth.resetPassword.confirmPassword')"
          prepend-inner-icon="mdi-lock-check-outline"
          :rules="[FORM_RULES.required]"
          :type="showConfirm ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="showConfirm = !showConfirm"
        />

        <!-- Error message -->
        <v-alert
          v-if="errorMessage"
          border="start"
          class="mb-5"
          closable
          color="error"
          variant="tonal"
        >
          {{ errorMessage }}
        </v-alert>

        <v-btn
          block
          class="mt-2 text-none"
          color="primary"
          :disabled="success"
          rounded="3"
          size="large"
          @click="isChangePasswordPage ? changePassword() : resetPassword()"
        >
          <v-icon class="mr-2" icon="mdi-lock-reset" />
          {{ isChangePasswordPage ? 'Change' : $t('auth.resetPassword.reset') }}
        </v-btn>
        <div class="text-medium-emphasis text-center mt-4">
          Go back
          <a
            class="text-primary"
            style="cursor: pointer;"
            @click="isChangePasswordPage ? $router.push({ name: 'UserProfile' }) : $router.push({ name: 'Login' })"
          >
            {{ $t('auth.forget.clickHere') }}
          </a>
        </div>
      </v-form>
    </v-col>
    <v-col class="pa-2" cols="6">
      <v-card
        class="d-flex justify-center align-center h-100"
        color="primary"
        elevation="0"
        rounded="lg"
      >
        <v-img :height="400" src="@/assets/images/reset_new_pwd_bg.png" />
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const instance = getCurrentInstance()

  const token = route.query.token || ''
  const form = ref(null)
  const loading = ref(false)
  const errorMessage = ref(null)
  const success = ref(false)
  const showCurrent = ref(false)
  const showPassword = ref(false)
  const showConfirm = ref(false)
  const currentPassword = ref(null)
  const showEmail = ref(null)
  const credential = reactive({
    password: '',
    confirmPassword: '',
  })
  const isChangePasswordPage = computed(() => route.query.page == 'change-my-passowrd')

  onBeforeMount(async () => {
    if (!authStore.user.data && !token) {
      return router.push({ name: 'Login' })
    }

    if (!authStore.user.data && isChangePasswordPage.value) {
      return router.push({ name: 'Login' })
    }

    if (authStore.user.data && !isChangePasswordPage.value) {
      return router.push({ name: 'Home' })
    }

    if (!authStore.user.data && token) {
      try {
        const { data } = await authStore.verifyResetPassword(token)
        showEmail.value = data.data.email
      } catch {
        errorMessage.value = 'Invalid or expired reset link'
        instance.root.$notif(errorMessage.value, { type: 'error' })
        router.push({ name: 'Login' })
      }

      return
    }
  })

  const resetPassword = async () => {
    errorMessage.value = ''

    const { valid } = await form.value.validate()
    if (!valid) return

    if (credential.password !== credential.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    try {
      loading.value = true

      await authStore.resetPassword(token, credential.password)

      success.value = true
      instance.root.$notif('Password changed successful', { type: 'success' })

      router.push({ name: 'Login' })
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || 'Failed to reset password'
    } finally {
      loading.value = false
    }
  }

  const changePassword = async () => {
    errorMessage.value = ''

    const { valid } = await form.value.validate()
    if (!valid) return

    if (credential.password !== credential.confirmPassword) {
      return errorMessage.value = 'Passwords do not match'
    }
    if (credential.password == currentPassword.value) {
      return errorMessage.value = 'Password is already used'
    }

    try {
      loading.value = true

      await authStore.updatePassword({
        password: currentPassword.value,
        new_password: credential.password,
      })

      success.value = true
      instance.root.$notif('Password changed successful', { type: 'success' })

      router.push({ name: 'UserProfile' })
    } catch (error) {
      errorMessage.value = error.response.data?.message || 'Failed to change password'
    } finally {
      loading.value = false
    }
  }
</script>
