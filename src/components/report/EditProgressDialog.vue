<template>
  <v-dialog max-width="300" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-number-input
                v-model="progress"
                density="compact"
                :label="t('report.fields.progress') + ' *'"
                :max="100"
                :min="0"
                :rules="[v=> v != null || t('app.rules.required'),v => v >= 0 || 'Must be at least 0', v => v <= 100 || 'Must be at most 100']"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn color="error" :text="t('app.btn.close')" variant="tonal" @click="close" />

        <v-btn
          class="text-none"
          color="primary"
          :text="t('app.btn.save')"
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

  const { updateReport } = useReportStore()
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
  const progress = ref(props.form?.progress || 0)
  const title = props.form.name

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      await updateReport(props.form.id, { progress: progress.value })
      instance.root.$notif(t('app.messages.saveSuccess'), { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || t('app.messages.errorOccurred'), { type: 'error' })
    }
  }
</script>
