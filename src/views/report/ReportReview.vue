<template>
  <BaseHeader :title="title">
    <div class="d-flex align-center">
      <v-btn
        class="text-none"
        color="error"
        prepend-icon="mdi-close-circle-outline"
        variant="outlined"
        @click="close"
      >
        {{ $t('app.btn.close') }}
      </v-btn>
    </div>
  </BaseHeader>

  <v-card rounded="4">
    <v-card-title class="bg-primary">
      {{ form.name }}
    </v-card-title>

    <v-card-text class="pt-4 doc pb-4">
      <div style="width: 900px;">
        <Editor
          v-model="form.content"
          :api-key="TINY_MCE_KEY"
          disabled
          :init="editorConfig"
          readonly="true"
        />
      </div>
    </v-card-text>
  </v-card>

</template>

<script setup>
  import Editor from '@tinymce/tinymce-vue'
  import router from '@/router'
  import { useReportStore } from '@/stores/index.js'

  const TINY_MCE_KEY = import.meta.env.VITE_APP_TINY_MCE_API_KEY || ''

  const { getById } = useReportStore()
  const { params } = useRoute()

  const editorConfig = {
    height: 700,
    menubar: false,
    toolbar: false,
    readonly: true,
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
    name: '',
    content: null,
  })

  // on mounted
  onMounted(async () => {
    try {
      const report = await getById(params.id)
      form.value.name = report.name
      form.value.content = report.content
    } catch {
      router.push({ name: '404' })
    }
  })

  const close = () => {
    router.push({ name: 'ReportHome', params: { type: params.type } })
  }
</script>

<style scoped>
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
