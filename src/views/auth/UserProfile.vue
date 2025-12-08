<template>
  <BaseHeader title="My Profile">
    <v-btn
      class="text-none"
      color="primary"
      prepend-icon="mdi-content-save"
      @click="save"
    >
      {{ $t('app.btn.update') }}
    </v-btn>
  </BaseHeader>

  <v-card rounded="4">
    <v-card-title class="bg-primary text-white">
      Personal Information
    </v-card-title>

    <v-card-text class="pt-4">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="3">
            <v-text-field
              v-model="form.first_name"
              clearable
              density="comfortable"
              label="First Name *"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="3">
            <v-text-field
              v-model="form.last_name"
              clearable
              density="comfortable"
              label="Last Name *"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="form.email"
              clearable
              density="comfortable"
              label="Email *"
              :rules="[FORM_RULES.required, FORM_RULES.email]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="form.phone_number"
              clearable
              density="comfortable"
              label="Phone Number"
              variant="outlined"
            />
          </v-col>

          <v-col cols="6">
            <v-select
              density="comfortable"
              disabled
              hide-details="auto"
              item-title="name"
              item-value="id"
              :items="user.roles"
              label="Role"
              :model-value="user.roles[0].id"
              variant="outlined"
            />
          </v-col>

          <v-col class="py-0" cols="6">
            Change new password
            <a
              class="text-primary"
              style="cursor: pointer;"
              @click="$router.push({ name: 'ResetPassword', query: { page: 'change-my-passowrd' } })"
            >
              {{ $t('auth.forget.clickHere') }}
            </a>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { useAuthStore } from '@/stores'
  import { FORM_RULES } from '@/validators/form-rules'

  // store
  const { getUser, updateProfile } = useAuthStore()
  const { user } = storeToRefs(useAuthStore())

  const instance = getCurrentInstance()

  const formRef = ref(null)

  const form = ref({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
  })

  onMounted(async () => {
    form.value = {
      first_name: user.value.data.first_name,
      last_name: user.value.data.last_name,
      phone_number: user.value.data.phone_number,
      email: user.value.data.email,
    }
  })

  const save = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    try {
      await updateProfile(form.value)
      instance.root.$notif('Profile updated successful', { type: 'success' })

      await getUser()
    } catch ({ response }) {
      if (response.status != 500) {
        return instance.root.$notif(response.data.message, { type: 'error' })
      }

      instance.root.$notif('Error updating profile', { type: 'error' })
    }
  }
</script>
