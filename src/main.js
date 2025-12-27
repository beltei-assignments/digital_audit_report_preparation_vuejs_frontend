import { createPinia } from 'pinia'
import { createApp } from 'vue'
import DataTable from '@/components/DataTable.vue'
import BaseHeader from '@/lib/components/BaseHeader.vue'
import App from './App.vue'
import i18n from './plugins/i18n'
import { rulesPlugin, vuetify } from './plugins/vuetify'
import router from './router'

// App
const app = createApp(App)
const pinia = createPinia()

app.component('DataTable', DataTable)
app.component('BaseHeader', BaseHeader)

// App switch language
const savedLocale = localStorage.getItem('locale') || 'kh'
i18n.global.locale.value = savedLocale

// App uses
app
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(rulesPlugin)
  .use(router)
  .mount('#app')
