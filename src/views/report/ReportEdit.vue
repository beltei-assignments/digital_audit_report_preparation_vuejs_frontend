<template>
  <BaseHeader :title="title">
    <div class="d-flex align-center">
      <v-btn
        class="text-none mr-2"
        color="error"
        prepend-icon="mdi-close-circle-outline"
        variant="outlined"
        @click="close"
      >
        {{ $t('app.btn.close') }}
      </v-btn>
      <v-btn
        class="text-none"
        color="primary"
        prepend-icon="mdi-content-save-outline"
        @click="save"
      >
        {{ $t('app.btn.save') }}
      </v-btn>
    </div>
  </BaseHeader>

  <v-expansion-panels v-model="panels">
    <v-expansion-panel>
      <v-expansion-panel-title class="expansion-title" color="primary">
        {{ $t('report.form.information') }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="formRef">
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="form.name"
                clearable
                density="comfortable"
                :label="t('regulator.fields.name') + ' *'"
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
            <v-col cols="3">
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
            <v-col cols="3">
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
            <v-col cols="3">
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
            <v-col cols="3">
              <v-number-input
                v-model="form.progress"
                density="comfortable"
                :label="t('report.fields.progress') + '(%) *'"
                :max="100"
                :min="0"
                :rules="[v=> v != null || t('app.rules.required')]"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- TinyMCE Section -->
  <v-card class="mt-2" rounded="4">
    <v-card-title class="bg-primary">
      {{ $t('report.fields.content') }}
    </v-card-title>

    <v-card-text class="pt-4 doc pb-8">
      <div style="width: 900px;">
        <Editor
          v-model="form.content"
          :api-key="TINY_MCE_KEY"
          :init="editorConfig"
        />
      </div>
    </v-card-text>
  </v-card>

</template>

<script setup>
  import Editor from '@tinymce/tinymce-vue'
  import { PRIORITY_OPTIONS, REPORT_TYPE_TITLE } from '@/constants'
  import { t } from '@/plugins/i18n'
  import router from '@/router'
  import { useRegulatorStore, useReportStore } from '@/stores/index.js'
  import { FORM_RULES } from '@/validators/form-rules.js'

  const TINY_MCE_KEY = import.meta.env.VITE_APP_TINY_MCE_API_KEY || ''

  const { getById, updateReport } = useReportStore()
  const { fetchRegulators } = useRegulatorStore()
  const { regulators } = storeToRefs(useRegulatorStore())
  const { params } = useRoute()

  const route = useRoute()
  const instance = getCurrentInstance()
  const panels = ref([0])
  const formRef = ref(null)

  const editorConfig = {
    height: 700,
    menubar: true,
    plugins:
      'advlist autolink lists link image charmap preview '
      + 'searchreplace code fullscreen insertdatetime media table',
    toolbar:
      'undo redo | bold italic underline strikethrough | styles fontfamily fontsize | '
      + 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    font_family_formats:
      'Times New Roman=times new roman,times,serif;'
      + 'Poppins=Poppins, sans-serif;'
      + 'Arial=arial,helvetica,sans-serif;'
      + 'Moul=Moul, sans-serif;'
      + 'Battambang=Battambang, sans-serif;'
      + 'Kantumruy Pro=Kantumruy Pro, sans-serif;'
      + 'Nokora=Nokora, sans-serif;',
    content_style: `
      @import url('https://fonts.googleapis.com/css2?family=Moul&family=Battambang&family=Kantumruy+Pro:wght@300;400;500&family=Nokora:wght@300;400;700&family=Poppins:wght@300;400;500;600&display=swap');

      body {
        font-family: 'Times New Roman', sans-serif !important;
        font-size: 16px;
      }
    `,
  }

  const form = ref({
    name: null,
    fk_regulator_id: null,
    priority: null,
    start_date: null,
    due_date: null,
    progress: 0,
    content: null,
  })

  // Computed
  const title = computed(() => t('app.btn.edit') + ' ' + REPORT_TYPE_TITLE[route.params.type])

  // on mounted
  onMounted(async () => {
    try {
      const report = await getById(params.id)
      form.value.name = report.name
      form.value.fk_regulator_id = report.fk_regulator_id
      form.value.priority = report.priority
      form.value.start_date = report.start_date
      form.value.due_date = report.due_date
      form.value.progress = report.progress
      form.value.content = report.content
    } catch {
      router.push({ name: '404' })
    }

    await fetchRegulators()
  })

  const save = async () => {
    const { valid } = await formRef.value.validate()

    if (!valid) return

    try {
      await updateReport(params.id, form.value)
      instance.root.$notif(t('app.messages.saveSuccess'), { type: 'success' })

      close()
    } catch ({ response }) {
      instance.root.$notif(response.data?.detail || t('app.messages.errorOccurred'), { type: 'error' })
    }
  }

  const close = () => {
    router.push({ name: 'ReportHome', params: { type: params.type } })
  }
</script>

<style>
  .expansion-title {
    min-height: 40px !important;
  }
  .tox .tox-statusbar__text-container.tox-statusbar__text-container--flex-start{
    display: none;
  }
  .doc {
    display: flex;
    justify-content: center !important;
  }
</style>
