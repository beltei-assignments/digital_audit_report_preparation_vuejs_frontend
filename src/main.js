import { createPinia } from 'pinia'
import { createApp } from 'vue'
import BaseHeader from '@/lib/components/BaseHeader.vue'
import App from './App.vue'
import i18n from './plugins/i18n'
import { rulesPlugin, vuetify } from './plugins/vuetify'
import router from './router'

// App
const app = createApp(App)
const pinia = createPinia()

app.component('BaseHeader', BaseHeader)

// App uses
app
  .use(pinia)
  .use(i18n)
  .use(vuetify)
  .use(rulesPlugin)
  .use(router)
  .mount('#app')
