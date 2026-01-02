<template>
  <!-- Count status -->
  <v-row dense>
    <v-col v-for="statusKey in Object.keys(count_statuses)" :key="statusKey" cols="12" md="4">
      <v-card :color="statusColors[statusKey]" rounded="lg" variant="tonal">
        <v-card-text>
          <h3>{{ statusTitles[statusKey] }}</h3>
          <h2>{{ count_statuses[statusKey] }}</h2>
          <p>{{ count_statuses[statusKey] > 1 ? $t('home.reports') : $t('home.report') }}</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isAuditor" dense>
    <!-- Count risks -->
    <v-col cols="12" md="6">
      <v-card color="primary" rounded="lg" variant="outlined">
        <v-card-title>
          <v-icon icon="mdi-file-document-alert-outline" /> {{ $t('home.risk.title') }}
        </v-card-title>

        <v-card-text class="pb-4">
          <v-row dense>
            <v-col v-for="riskKey in Object.keys(count_risks)" :key="riskKey" cols="6">
              <v-card color="primary" rounded="lg" variant="tonal">
                <v-card-text>
                  <v-chip :color="riskColors[riskKey]" variant="flat">
                    {{ riskTitles[riskKey] }}
                  </v-chip>
                  <h2
                    :class="{'text-link': count_risks[riskKey].total > 0}"
                    @click="goToReportList(count_risks[riskKey].report_ids)"
                  >{{ count_risks[riskKey].total }}</h2>
                  <p>{{ count_risks[riskKey].total > 1 ? $t('home.reports') : $t('home.report') }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Alerts -->
    <v-col cols="12" md="6">
      <v-card color="error" rounded="lg" variant="outlined">
        <v-card-title>
          <v-icon icon="mdi-bell-outline" /> {{ $t('home.alert.title') }} ({{ alerts.length }})
        </v-card-title>

        <v-card-text class="pb-2">
          <div v-if="alerts.length === 0" class="text-center">{{ $t('home.alert.no') }}</div>

          <v-card
            v-for="alert in alerts"
            :key="alert.id"
            class="mb-2"
            color="error"
            rounded="lg"
            variant="tonal"
          >
            <v-card-text>
              <div class="d-flex">
                <v-icon class="mr-3" icon="mdi-alert-outline" />
                <v-row dense>
                  <v-col class="py-0" cols="12">
                    <p class="text-black text-link" @click="goToEditReport(alert.report)">{{ alert.message }}</p>
                  </v-col>
                  <v-col class="py-0" cols="12">
                    <small class="text-grey-darken-2">{{ $t('home.alert.dueDate') }}: {{ formatDate(alert.report.due_date, true) }}</small>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
  import { REPORT_TYPE_NAME, ROLE_NAME, STATUS_ID } from '@/constants'
  import { t } from '@/plugins/i18n'
  import router from '@/router'
  import { useAuthStore, useReportStore } from '@/stores'
  import { isHasRole } from '@/utils/authorization'
  import { formatDate } from '@/utils/date'

  const { countStatus, generateNotifications } = useReportStore()

  const { user } = storeToRefs(useAuthStore())
  const { count_statuses, count_risks, alerts } = storeToRefs(useReportStore())
  const isManager = ref(isHasRole(user.value, ROLE_NAME.MANAGER))
  const isAuditor = ref(isHasRole(user.value, ROLE_NAME.AUDITOR))

  const riskColors = ref({
    critical: 'error',
    high: 'orange',
    medium: 'warning',
    low: 'success',
  })
  const riskTitles = ref({
    critical: t('home.risk.critical'),
    high: t('home.risk.high'),
    medium: t('home.risk.medium'),
    low: t('home.risk.low'),
  })
  const statusColors = ref({
    [STATUS_ID.WAITING_FOR_REVIEW]: 'warning',
    [STATUS_ID.APPROVED]: 'success',
    [STATUS_ID.REJECTED]: 'error',
  })
  const statusTitles = ref({
    [STATUS_ID.WAITING_FOR_REVIEW]: t('home.waitingReview'),
    [STATUS_ID.APPROVED]: t('home.approved'),
    [STATUS_ID.REJECTED]: t('home.rejected'),
  })

  onMounted(async () => {
    await countStatus({ ...(!isManager.value && { is_auditor: true }) })

    if (!isManager.value) {
      await generateNotifications()
    }
  })

  const goToEditReport = ({ id, fk_report_type_id }) => {
    router.push({
      name: 'ReportEdit',
      params: {
        type: REPORT_TYPE_NAME[fk_report_type_id],
        id,
      },
      query: { returnback: true },
    })
  }
  const goToReportList = ids => {
    if (ids.length === 0) return

    router.push({
      name: 'ReportList',
      query: { ids: JSON.stringify(ids) },
    })
  }
</script>

<style scoped>
  .text-link:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
