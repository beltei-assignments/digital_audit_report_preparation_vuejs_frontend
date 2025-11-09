<template>
  <div class="h-screen d-flex justify-center align-center bg-white">
    <v-form
      class="form d-flex flex-column align-center rounded-lg w-40 px-8 py-10"
      @submit.prevent="send"
    >
      <div class="d-flex flex-column align-center justify-center text-center">
        <v-icon
          class="logo mb-4 text-primary"
          icon="mdi-lock-question"
        />
        <h2>{{ $t('auth.forget.title') }}</h2>
        <!-- <span
          >Enter your <span class="text-red-accent-2">email address</span> to
          send link to reset your password.</span
        > -->
        <span>{{
          $t('auth.forget.subTitle', { email: $t('auth.email') })
        }}</span>
      </div>
      <div class="w-100 mt-4">
        <v-text-field
          v-model="credential.email"
          class="text-black placeholer-capitalize"
          density="compact"
          name="username"
          :placeholder="$t('auth.email')"
          prepend-inner-icon="mdi-email-outline"
          type="email"
          variant="outlined"
        />
      </div>
      <!-- <primary-button
        @click="v$.$touch()"
        :disabled="success"
        class="mt-2 text-uppercase"
        block
        size="large"
        type="medium"
      >
        <v-icon icon="mdi-login-variant" class="mr-2"></v-icon>
        {{ $t('auth.forgot.send') }}
      </primary-button> -->
      <v-btn
        block
        class="mt-2 text-none"
        color="primary"
        :disabled="success"
        rounded="3"
        size="large"
        @click="v$.$touch()"
      >
        <v-icon class="mr-2" icon="mdi-login-variant" />
        {{ $t('auth.forget.send') }}
      </v-btn>
      <span class="mt-3 cursor text-primary" @click="$router.push('/login')">{{
        $t('auth.forget.back')
      }}</span>
    </v-form>
  </div>
</template>

<script setup>
  import useVuelidate from '@vuelidate/core'
  import { email, helpers, required } from '@vuelidate/validators'
  import { useRouter } from 'vue-router'
  import http from '@/utils/http.js'
  import { t } from '../../plugins/i18n'

  // Variables
  const instance = getCurrentInstance()
  const router = useRouter()
  const success = ref(false)
  // const errMessage = ref('')
  const initialsUser = {
    email: '',
  }
  const credential = reactive({
    ...initialsUser,
  })
  const rules = {
    email: {
      required: helpers.withMessage(t('app.rules.required'), required),
      email: helpers.withMessage(t('app.rules.email'), email),
    },
  }
  const v$ = useVuelidate(rules, credential)

  // Method
  const send = async () => {
    if (v$.value.$errors.length === 0) {
      try {
        await http.post('auth/send-pwd', credential)
        success.value = true
        instance.root.$notif(t('auth.forgot.success'), {
          type: 'success',
          timeout: null,
        })
        router.push('/login')
      } catch {
        instance.root.$notif('Your email is invalid', { type: 'error' })
      }
    }
  }
</script>

<style scoped>
  .w-40 {
    width: 40%;
  }

  .logo {
    font-size: 10rem;
  }

  .cursor {
    cursor: pointer;
  }

  @media screen and (max-width: 900px) {
    .form {
      width: 60%;
    }
  }

  @media screen and (max-width: 430px) {
    .form {
      width: 100%;
    }
  }
</style>
