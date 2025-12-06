<template>
  <v-row class="h-screen" no-gutters>
    <v-col class="d-flex justify-center align-center" cols="6">
      <v-form ref="form" class="w-50">
        <h1>{{ $t('auth.resetPassword.title') }}</h1>
        <v-text-field
          v-model="credential.password"
          class="text-black placeholder-capitalize mt-4"
          density="compact"
          :placeholder="$t('auth.resetPassword.newPassword')"
          prepend-inner-icon="mdi-lock-outline"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-text-field
          v-model="credential.confirmPassword"
          class="text-black placeholder-capitalize mt-4"
          density="compact"
          :placeholder="$t('auth.resetPassword.confirmPassword')"
          prepend-inner-icon="mdi-lock-check-outline"
          :type="showConfirm ? 'text' : 'password'"
          variant="outlined"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirm = !showConfirm"
        />
        <!-- Error message -->
        <v-alert
          v-if="errorMessage"
          border="start"
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
          @click="resetPassword"
        >
          <v-icon class="mr-2" icon="mdi-lock-reset" />
          {{ $t('auth.resetPassword.reset') }}
        </v-btn>
        <div class="text-medium-emphasis text-center mt-4">
          {{ $t('auth.forget.back') }}
          <a
            class="text-primary"
            style="cursor: pointer;"
            @click="$router.push('/login')"
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
  import { ref, reactive, onBeforeMount, getCurrentInstance } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const instance = getCurrentInstance()
  const token = route.query.token || ''
  const form = ref(null)
  const loading = ref(false)
  const errorMessage = ref(null)
  const success = ref(false)
  const showPassword = ref(false)
  const showConfirm = ref(false)
  const credential = reactive({
    password: '',
    confirmPassword: '',
  })

  // Verify token before allowing password reset
  onBeforeMount(async () => {
    if (!token) {
      errorMessage.value = 'Reset token is missing'
      router.push('/login')
      return
    }

    try {
      await authStore.verifyResetPassword(token)
    } catch (err) {
      errorMessage.value = 'Invalid or expired reset link'
      instance.root.$notif(errorMessage.value, { type: 'error' })
      router.push('/login')
    }
  })

  const resetPassword = async () => {
    errorMessage.value = ''

    if (!credential.password || !credential.confirmPassword) {
      errorMessage.value = 'Please fill all fields'
      return
    }
    if (credential.password !== credential.confirmPassword) {
      errorMessage.value = 'Passwords do not match'
      return
    }

    try {
      loading.value = true
      const res = await authStore.resetPassword(token, credential.password)
      success.value = true
      instance.root.$notif(res.message || 'Password changed successfully', { type: 'success' })
      router.push('/login')
    } catch (err) {
      errorMessage.value = err?.response?.data?.message || 'Failed to reset password'
    } finally {
      loading.value = false
    }
  }
</script>
