<template>
  <v-row class="h-screen" no-gutters>
    <v-col class="d-flex justify-center align-center" cols="6">
      <v-form ref="form" class="w-50">
        <h1>{{ $t('auth.forget.title') }}</h1>

        <v-text-field
          v-model="credential.email"
          class="text-black placeholer-capitalize mt-4"
          density="compact"
          name="username"
          :placeholder="$t('auth.email')"
          prepend-inner-icon="mdi-email-outline"
          :rules="rules.email"
          type="email"
          variant="outlined"
        />

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
          @click="send"
        >
          <v-icon class="mr-2" icon="mdi-login-variant" />
          {{ $t('auth.forget.send') }}
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
        <v-img :height="400" src="@/assets/images/send_reset_pwd_bg.png" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
  import { t } from '@/plugins/i18n'
  import { useAuthStore } from '@/stores'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const authStore = useAuthStore()
  const router = useRouter()
  const instance = getCurrentInstance()

  const form = ref(null)
  const loading = ref(false)
  const errorMessage = ref(null)
  const success = ref(false)

  const credential = reactive({ email: '' })

  const rules = computed(() => ({
    email: [v => !!v || t('auth.rules.enterYourEmail'), FORM_RULES.email],
  }))

  const send = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    try {
      loading.value = true
      errorMessage.value = null

      const res = await authStore.sendResetPassword(credential.email)

      success.value = true
      router.push({ name: 'Login' })

      instance.root.$notif(res.message, { type: 'success' })
    } catch (error) {
      errorMessage.value = error.response.data.message || t('app.rules.loginFail')
    } finally {
      loading.value = false
    }
  }
</script>
