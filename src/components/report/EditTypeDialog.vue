<template>
  <v-dialog max-width="400" :model-value="props.modelValue" persistent>
    <v-card rounded="4">
      <v-card-title class="bg-primary">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="type"
                density="compact"
                hide-details
                :items="REPORT_TYPE_OPTIONS"
                :label="$t('report.fields.moveTo')"
                :rules="[FORM_RULES.required]"
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
  import { REPORT_TYPE_ID, REPORT_TYPE_OPTIONS } from '@/constants'
  import { t } from '@/plugins/i18n'
  import { useReportStore } from '@/stores/index.js'
  import { FORM_RULES } from '@/validators/form-rules.js'

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
  const type = ref(props.form.fk_report_type_id)
  const title = props.form.name

  // method
  const close = () => {
    emit('update:modelValue', false)
  }
  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    const isAuditType = type.value == REPORT_TYPE_ID.AUDIT

    try {
      await updateReport(
        props.form.id,
        {
          fk_report_type_id: type.value,
          ...(isAuditType && { progress: 100 }),
        },
      )
      instance.root.$notif(t('app.messages.saveSuccess'), { type: 'success' })

      emit('load')
      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || t('app.messages.errorOccurred'), { type: 'error' })
    }
  }
</script>
