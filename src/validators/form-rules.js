import { t } from '@/plugins/i18n'

export const FORM_RULES = {
  required: v => !!v || t('app.rules.required'),
  email: v =>
    !v
    || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
    || t('app.rules.invalidEmail'),
  min: (min, v) => v.length >= min || `Minimum length is ${min} characters`,
}
