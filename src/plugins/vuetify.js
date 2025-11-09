// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createRulesPlugin } from 'vuetify/labs/rules'
import { VIconBtn } from 'vuetify/labs/VIconBtn'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/sass/variables.scss'

const customTheme = {
  dark: false,
  colors: {
    primary: '#425EB2',
    secondary: '#FB8500',
    success: '#4CAF50',
    info: '#02BDFE',
    warning: '#FCBE01',
    error: '#D32F2F',
    surface: '#FFFFFF',
  },
}

export const vuetify = createVuetify({
  components: {
    VIconBtn,
    ...components,
  },
  directives,
  theme: {
    options: {
      customProperties: true,
    },
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    },
  },
})

export const rulesPlugin = createRulesPlugin({}, vuetify.locale)
