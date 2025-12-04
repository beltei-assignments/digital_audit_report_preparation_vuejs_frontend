<template>
  <v-dialog max-width="600" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-error">
        {{ $t('report.confirm.rejectTitle') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-textarea
                v-model="reason"
                density="compact"
                hide-details
                :label="$t('report.fields.reason')"
                rows="3"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="text-none"
          :text="t('app.btn.close')"
          variant="tonal"
          @click="close"
        />

        <v-btn
          class="text-none"
          color="error"
          :text="t('app.btn.reject')"
          variant="flat"
          @click="save"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { t } from '@/plugins/i18n'
  import { useReportStore } from '@/stores/index.js'

  const { sendRequest } = useReportStore()
  const emit = defineEmits(['update:modelValue', 'load'])
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object,
      required: false,
      default: () => ({
        name: '',
      }),
    },
  })
  const instance = getCurrentInstance()
  const formRef = ref(null)
  const reason = ref(null)

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      await sendRequest(props.form.id, { reason: reason.value, request_type: 'MANAGER_REJECTED' })

      instance.root.$notif(t('app.messages.sentSuccess'), { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || t('app.messages.errorOccurred'), { type: 'error' })
    }
  }
</script>
