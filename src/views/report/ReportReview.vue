<template>
  <BaseHeader title="">
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

    <v-card-text class="pt-4 doc pb-2">
      <div style="width: 800px;">
        <Editor
          v-model="form.content"
          :api-key="TINY_MCE_KEY"
          disabled
          :init="editorConfig"
          readonly
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn append-icon="mdi-file-pdf-box" class="text-none" variant="tonal" @click="downloadPDF">
        {{ $t('report.download.pdf') }} (.pdf)
      </v-btn>
      <v-btn append-icon="mdi-microsoft-word" class="text-none" variant="tonal" @click="downloadDocx">
        {{ $t('report.download.docx') }} (.docx)
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script setup>
  import Editor from '@tinymce/tinymce-vue'
  import router from '@/router'
  import { useReportStore } from '@/stores/index.js'
  import { exportHTMLToDocx } from '@/utils/file-export'

  const TINY_MCE_KEY = import.meta.env.VITE_APP_TINY_MCE_API_KEY || ''

  const { getById, exportPDF } = useReportStore()
  const { params } = useRoute()

  const route = useRoute()
  const editorConfig = {
    height: 660,
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
    if (route.query.returnback) {
      return router.back()
    }

    router.push({ name: 'ReportHome', params: { type: params.type } })
  }

  const downloadDocx = () => {
    const tinyMCEIframe = document.querySelector('.tox-edit-area__iframe')
    const html = tinyMCEIframe.contentDocument.documentElement.outerHTML

    exportHTMLToDocx({ html, filename: form.value.name })
  }

  const downloadPDF = async () => {
    const tinyMCEIframe = document.querySelector('.tox-edit-area__iframe')
    const html = tinyMCEIframe.contentDocument.documentElement.outerHTML

    const blob = await exportPDF({ html, filename: form.value.name })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.value.name}.pdf`
    document.body.append(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
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
