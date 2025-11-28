import { t } from '@/plugins/i18n'

export const REPORT_TYPE_ID = {
  DRAFT: 1,
  PRIMARY: 2,
  AUDIT: 3,
}

export const REPORT_TYPE_CODE = {
  DRAFT: 'draft',
  PRIMARY: 'primary',
  AUDIT: 'audit',
}

export const REPORT_TYPE_TITLE = {
  [REPORT_TYPE_CODE.DRAFT]: t('report.draft'),
  [REPORT_TYPE_CODE.PRIMARY]: t('report.primary'),
  [REPORT_TYPE_CODE.AUDIT]: t('report.audit'),
}
