<template>
  <div class="h-screen bg-grey-lighten-1 d-flex justify-center align-center">
    <v-form
      class="form d-flex flex-column align-center rounded-lg w-40 px-8 py-10"
      @submit.prevent="reset"
    >
      <div class="d-flex text-center flex-column align-center justify-center">
        <v-icon
          class="logo mb-4 text-red-accent-2"
          icon="mdi-shield-lock"
        />
        <h2>Reset a new password</h2>
        <span>Please create a new password for
          <span class="text-red-accent-2">{{ userEmail }}</span>.</span>
      </div>
      <div class="w-100 mt-4">
        <v-text-field
          v-model="passwords.password"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black"
          density="compact"
          :error-messages="v$.password.$errors.map((e) => e.$message)"
          placeholder="New password"
          prepend-inner-icon="mdi-lock-outline"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          @blur="v$.password.$touch"
          @click:append-inner="showPassword = !showPassword"
          @input="v$.password.$touch"
        />
        <v-text-field
          v-model="passwords.confirmPassword"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          class="text-black mt-2"
          density="compact"
          :error-messages="v$.confirmPassword.$errors.map((e) => e.$message)"
          placeholder="Confirm password"
          prepend-inner-icon="mdi-lock-check-outline"
          :rules="[passwordConfirmationRule]"
          :type="showConfirm ? 'text' : 'password'"
          variant="outlined"
          @blur="v$.confirmPassword.$touch"
          @click:append-inner="showConfirm = !showConfirm"
          @input="v$.confirmPassword.$touch"
        />
      </div>
      <primary-button
        block
        class="mt-2"
        :disabled="success"
        size="large"
        type="medium"
        @click="v$.$touch()"
      >
        <v-icon class="mr-2" icon="mdi-lock-reset" />
        RESET
      </primary-button>
    </v-form>
  </div>
</template>

<script setup>
  import useVuelidate from '@vuelidate/core'
  import { minLength, required } from '@vuelidate/validators'
  import { useRouter } from 'vue-router'
  import http from '@/utils/http.js'

  // Variables
  const instance = getCurrentInstance()
  const router = useRouter()
  const props = defineProps(['token', 'email'])
  const userEmail = ref('unknown user')
  const success = ref(false)
  const showPassword = ref(false)
  const showConfirm = ref(false)
  const initialsPassword = {
    password: '',
    confirmPassword: '',
  }
  const passwords = reactive({
    ...initialsPassword,
  })
  const rules = {
    password: { required, minLength: minLength(8) },
    confirmPassword: { required },
  }
  const v$ = useVuelidate(rules, passwords)
  // Validation confirm password
  const passwordConfirmationRule = () => {
    return passwords.password === passwords.confirmPassword ? true : 'Confirm password must be match.'
  }

  // Method
  const reset = async () => {
    if (v$.value.$errors.length === 0 && passwordConfirmationRule() === true) {
      const resetData = {
        token: props.token,
        password: passwords.password,
      }
      try {
        await http.post('auth/reset-pwd', resetData)
        success.value = true
        instance.root.$notif('Your password is changed', { type: 'success' })
        router.push('/login')
      } catch {
        instance.root.$notif('Couldn\'t find your reset password link', {
          type: 'error',
        })
        router.push('/login')
      }
    }
  }
  // Lifecycle hook
  onBeforeMount(async () => {
    const resetData = {
      token: props.token,
    }
    // Check email and token reset password in database
    try {
      const res = await http.post('/auth/check-pwd', resetData)
      userEmail.value = res.data.data.email
    } catch (error) {
      if (!error.response.data.success) {
        instance.root.$notif('Couldn\'t find your reset password link', {
          type: 'error',
        })
        router.push('/login')
      }
    }
  })
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
