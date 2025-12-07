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
  REQUEST_REVIEW: 'request-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const REPORT_TYPE_NAME = {
  [REPORT_TYPE_ID.DRAFT]: REPORT_TYPE_CODE.DRAFT,
  [REPORT_TYPE_ID.PRIMARY]: REPORT_TYPE_CODE.PRIMARY,
}

export const REPORT_TYPE_TITLE = {
  [REPORT_TYPE_CODE.DRAFT]: t('report.draft'),
  [REPORT_TYPE_CODE.PRIMARY]: t('report.primary'),
  [REPORT_TYPE_CODE.AUDIT]: t('report.audit'),
  [REPORT_TYPE_CODE.REQUEST_REVIEW]: t('app.nav.requestReview'),
  [REPORT_TYPE_CODE.APPROVED]: t('app.nav.approved'),
  [REPORT_TYPE_CODE.REJECTED]: t('app.nav.rejected'),
}

export const REPORT_TYPE_OPTIONS = [
  { title: REPORT_TYPE_TITLE[REPORT_TYPE_CODE.DRAFT], value: REPORT_TYPE_ID.DRAFT },
  { title: REPORT_TYPE_TITLE[REPORT_TYPE_CODE.PRIMARY], value: REPORT_TYPE_ID.PRIMARY },
  { title: REPORT_TYPE_TITLE[REPORT_TYPE_CODE.AUDIT], value: REPORT_TYPE_ID.AUDIT },
]
