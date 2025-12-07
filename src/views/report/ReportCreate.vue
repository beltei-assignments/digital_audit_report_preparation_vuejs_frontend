<template>
  <BaseHeader :title="title">
    <v-btn
      class="text-none mr-2"
      color="error"
      prepend-icon="mdi-close-circle-outline"
      variant="outlined"
      @click="$router.back()"
    >
      {{ $t('app.btn.close') }}
    </v-btn>
    <v-btn
      append-icon="mdi-chevron-right"
      class="text-none"
      color="primary"
      @click="save"
    >
      {{ $t('app.btn.next') }}
    </v-btn>
  </BaseHeader>

  <v-card rounded="4">
    <v-card-title class="bg-primary">
      {{ $t('report.form.information') }}
    </v-card-title>
    <v-card-text class="pt-4">
      <v-form ref="formRef">
        <v-row dense>
          <v-col cols="6">
            <v-text-field
              v-model="form.name"
              clearable
              density="comfortable"
              :label="t('report.fields.name') + ' *'"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="form.fk_regulator_id"
              clearable
              density="comfortable"
              hide-details="auto"
              item-title="name"
              item-value="id"
              :items="regulators"
              :label="$t('report.fields.regulator') + ' *'"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="form.priority"
              clearable
              density="comfortable"
              hide-details="auto"
              :items="PRIORITY_OPTIONS"
              :label="$t('report.fields.priority') + ' *'"
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <v-date-input
              v-model="form.start_date"
              clearable
              density="comfortable"
              :label="$t('report.fields.startDate') + ' *'"
              :max="form.due_date"
              persistent-placeholder
              prepend-icon=""
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <v-date-input
              v-model="form.due_date"
              clearable
              density="comfortable"
              :label="$t('report.fields.dueDate') + ' *'"
              :min="form.start_date"
              persistent-placeholder
              prepend-icon=""
              :rules="[FORM_RULES.required]"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { PRIORITY_OPTIONS, REPORT_TYPE_ID, REPORT_TYPE_TITLE, STATUS_ID } from '@/constants'
  import { t } from '@/plugins/i18n'
  import router from '@/router'
  import { useRegulatorStore, useReportStore } from '@/stores/index.js'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const { createReport } = useReportStore()
  const { fetchRegulators } = useRegulatorStore()
  const { regulators } = storeToRefs(useRegulatorStore())

  const route = useRoute()
  const instance = getCurrentInstance()
  const formRef = ref(null)
  const form = ref({
    name: null,
    fk_regulator_id: null,
    priority: null,
    start_date: null,
    due_date: null,
  })

  // Computed
  const reportType = computed(() => route.params.type)
  const title = computed(() => t('app.btn.create') + ' ' + REPORT_TYPE_TITLE[route.params.type])

  // on mounted
  onMounted(async () => {
    await fetchRegulators()
  })

  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      const typeId = REPORT_TYPE_ID[reportType.value.toUpperCase()]

      const { data } = await createReport({
        ...form.value,
        fk_report_type_id: typeId,
        fk_status_id: STATUS_ID.PREPARING,
        progress: 0,
      })
      instance.root.$notif(t('app.messages.saveSuccess'), { type: 'success' })

      router.push({ name: 'ReportEdit', params: { id: data.id } })
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || t('app.messages.errorOccurred'), { type: 'error' })
    }
  }
</script>
