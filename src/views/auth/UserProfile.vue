<template>
  <BaseHeader :title="$t('app.nav.profile')">
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
      {{ $t('profile.form.title') }}
    </v-card-title>

    <v-card-text class="pt-4">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.first_name"
              clearable
              density="comfortable"
              :label="`${$t('profile.fields.firstName')} *`"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.last_name"
              clearable
              density="comfortable"
              :label="`${$t('profile.fields.lastName')} *`"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              clearable
              density="comfortable"
              :label="`${$t('profile.fields.email')} *`"
              :rules="[FORM_RULES.required, FORM_RULES.email]"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phone_number"
              clearable
              density="comfortable"
              :label="$t('profile.fields.phone')"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              density="comfortable"
              disabled
              :item-title="`name_${i18n.global.locale.value}`"
              item-value="id"
              :items="user.roles"
              :label="$t('profile.fields.role')"
              :model-value="user.roles[0].id"
              variant="outlined"
            />
          </v-col>

          <v-col class="py-0" cols="12" md="6">
            {{ $t('profile.form.changeNewPassword') }}
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
  import i18n, { t } from '@/plugins/i18n'
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
      instance.root.$notif(t('profile.messages.profileChanged'), { type: 'success' })

      await getUser()
    } catch ({ response }) {
      if (response.status != 500) {
        return instance.root.$notif(response.data.message, { type: 'error' })
      }

      instance.root.$notif(t('app.messages.errorOccurred'), { type: 'error' })
    }
  }
</script>
