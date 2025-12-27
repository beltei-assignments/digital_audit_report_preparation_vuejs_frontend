<template>
  <v-row class="h-screen" no-gutters>
    <v-col class="position-relative d-flex flex-column justify-center align-center" cols="12" md="6">
      <div class="lang-menu">
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" append-icon="mdi-menu-down" class="text-none" variant="text">
              {{ $t(`app.lang.${i18n.global.locale.value}`) }}
            </v-btn>
          </template>
          <v-list @update:selected="changeLanguage">
            <v-list-item value="kh">
              <v-list-item-title>{{ $t('app.lang.kh') }}</v-list-item-title>
            </v-list-item>
            <v-list-item value="en">
              <v-list-item-title>{{ $t('app.lang.en') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </div>

      <v-form ref="form" class="w-50 form">
        <h1>{{ $t('auth.loginToContinue') }}</h1>
        <v-text-field
          v-model="credentials.email"
          autocomplete="username"
          class="text-black placeholer-capitalize mt-4"
          density="compact"
          name="username"
          :placeholder="$t('auth.email')"
          prepend-inner-icon="mdi-email-outline"
          :rules="rules.email"
          type="email"
          variant="outlined"
        />

        <v-text-field
          v-model="credentials.password"
          :append-inner-icon="visablePassword ? 'mdi-eye-off' : 'mdi-eye'"
          autocomplete="current-password"
          class="text-black mt-2"
          density="compact"
          name="password"
          :placeholder="$t('auth.password')"
          prepend-inner-icon="mdi-lock-outline"
          :rules="rules.password"
          :type="visablePassword ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="visablePassword = !visablePassword"
          @keyup.enter="connect"
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
          :loading="loading"
          rounded="3"
          size="large"
          @click="connect"
        >
          <v-icon class="mr-2" icon="mdi-login-variant" />
          {{ $t('auth.login') }}
        </v-btn>

        <div class="text-medium-emphasis text-center mt-4">
          {{ $t('auth.forget.forget') }}
          <a
            class="text-primary"
            style="cursor: pointer;"
            @click="$router.push({ name: 'ForgotPassword' })"
          >
            {{ $t('auth.forget.clickHere') }}
          </a>
        </div>
      </v-form>
    </v-col>
    <v-col class="pa-2 image" cols="12" md="6">
      <v-card class="d-flex justify-center align-center h-100" color="primary" elevation="0" rounded="lg">
        <v-img :height="400" src="@/assets/images/login_bg.png" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import i18n, { t } from '@/plugins/i18n'

  import { useAuthStore } from '@/stores'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const authStore = useAuthStore()
  const router = useRouter()
  const form = ref(null)
  const visablePassword = ref(false)
  const loading = ref(false)
  const errorMessage = ref(null)
  const credentials = reactive({
    email: '',
    password: '',
  })
  const rules = computed(() => {
    return {
      email: [v => !!v || t('auth.rules.enterYourEmail'), FORM_RULES.email],
      password: [v => !!v || t('auth.rules.enterYourPasseord')],
    }
  })

  const connect = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    try {
      loading.value = true
      errorMessage.value = null

      await authStore.login(credentials.email, credentials.password)

      router.push({ name: 'Home' })
    } catch (error) {
      errorMessage.value = error.response.data.message || t('app.rules.loginFail')
    } finally {
      loading.value = false
    }
  }

  const changeLanguage = ([locale]) => {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
  }
</script>

<style scoped>
  .lang-menu {
    position: absolute;
    top: 8px;
    right: 0;
  }

  @media screen and (max-width:600px) {
    .lang-menu {
      right: 8px;
    }

    .image {
      display: none;
    }

    .form {
      width: 80% !important;
    }
  }
</style>
