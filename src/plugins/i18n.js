import { createI18n } from 'vue-i18n'

function loadLocaleMessages () {
  const messages = {}
  const files = import.meta.glob('@/locales/*/*.json', { eager: true })

  for (const path of Object.keys(files)) {
    const matched = path.match(/locales\/([A-Za-z0-9-_]+)\/(.+)\.json$/i)

    if (matched && matched.length > 2) {
      const locale = matched[1]
      const namespace = matched[2]

      if (!messages[locale]) {
        messages[locale] = {}
      }
      messages[locale][namespace] = files[path].default
    }
  }

  return messages
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
})

export default i18n

export const t = key => {
  return i18n.global.t(key)
}
