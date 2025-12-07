<template>
  <div class="app-wrapper">
    <div>
      <BaseHeader :title="title">
        <v-btn
          v-if="isFilter"
          class="text-none mr-2"
          color="error"
          prepend-icon="mdi-filter-remove-outline"
          variant="outlined"
          @click="clearFilter"
        >
          {{ $t('app.btn.clear') }}
        </v-btn>

        <v-btn
          class="text-none mr-2"
          color="warning"
          prepend-icon="mdi-filter-outline"
          :variant="isFilter ? 'flat' : 'outlined'"
          @click="isFilter = !isFilter"
        >
          {{ $t('app.btn.filter') }}
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          prepend-icon="mdi-plus"
          @click="onCreate"
        >
          {{ $t('app.btn.create') }}
        </v-btn>
      </BaseHeader>

      <!-- Filter -->
      <v-card v-if="isFilter" class="mb-2 pa-3" rounded="3">
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="filter.id"
              clearable
              density="compact"
              hide-details="auto"
              :label="$t('regulator.fields.id')"
              variant="outlined"
              @update:model-value="onFilterChange"
            />
          </v-col>
          <v-col cols="12" :sm="!isManager ? 4 : 8">
            <v-text-field
              v-model="filter.name"
              clearable
              density="compact"
              hide-details="auto"
              :label="$t('regulator.fields.name')"
              variant="outlined"
              @update:model-value="onFilterChange"
            />
          </v-col>
          <v-col v-if="!isManager" cols="12" sm="4">
            <v-select
              v-model="filter.priority"
              clearable
              density="compact"
              hide-details="auto"
              :items="PRIORITY_OPTIONS"
              :label="$t('report.fields.priority')"
              variant="outlined"
              @update:model-value="onFilterChange"
            />
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- Table -->
    <div class="bottom">
      <DataTable
        v-model:options="options"
        :headers="headers"
        :items="reports"
        :items-length="totalCount"
        :items-per-page-options="[10, 20, 50, 100]"
        @update:options="search"
      >
        <template #[`item.reprotName`]="{ item }">
          <div style="width: 160px;">{{ item.name }}</div>
        </template>
        <template #[`item.regulatorName`]="{ item }">
          <div style="width: 160px;">{{ item.regulator.name }}</div>
        </template>
        <template #[`item.priorityChip`]="{ item }">
          <v-chip class="text-capitalize" color="primary" variant="flat">
            {{ item.priority }}
          </v-chip>
        </template>
        <template #[`item.progressPercentage`]="{ item }">
          <v-progress-linear
            class="progress"
            color="primary"
            height="22"
            :model-value="item.progress"
            @click="onEditProgress(item)"
          >
            <strong>{{ Math.ceil(item.progress) }}%</strong>
          </v-progress-linear>
        </template>
        <template #[`item.statusName`]="{ item }">
          <v-chip class="text-capitalize" :color="getStatusColor(item)">
            {{ item.status.name }}
          </v-chip>
        </template>
        <template #[`item.requestedUser`]="{ item }">
          {{ item.user.first_name }} {{ item.user.last_name }}
        </template>
        <template #[`item.creationDate`]="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #[`item.requestedAt`]="{ item }">
          {{ formatDate(item.requested_review_at) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex align-center justify-end">
            <v-icon-btn
              v-if="!isManager"
              color="info"
              icon="mdi-file-move"
              :title="$t('app.btn.move')"
              variant="text"
              @click="onMove(item)"
            />
            <v-icon-btn
              color="primary"
              icon="mdi-eye"
              :title="$t('app.btn.view')"
              variant="text"
              @click="onView(item)"
            />
            <v-icon-btn
              v-if="!isAuditReportType && !isManager"
              color="warning"
              icon="mdi-pencil"
              :title="$t('app.btn.edit')"
              variant="text"
              @click="onEdit(item)"
            />
            <v-icon-btn
              v-if="!isAuditReportType && !isManager"
              color="error"
              icon="mdi-delete"
              :title="$t('app.btn.delete')"
              variant="text"
              @click="onDelete(item.id)"
            />
            <v-icon-btn
              v-if="isAuditReportType && !isManager"
              color="success"
              :disabled="isDisabledRequestReview(item)"
              icon="mdi-send-circle"
              :title="$t('report.btn.sendRequestReview')"
              variant="text"
              @click="onSendRequest(item)"
            />
            <v-icon-btn
              v-if="isManager && !isApprovedType"
              color="success"
              icon="mdi-file-document-check"
              :title="$t('app.btn.approve')"
              variant="text"
              @click="onApprove(item)"
            />
            <v-icon-btn
              v-if="isManager && !isRejectedType"
              color="error"
              icon="mdi-file-document-remove"
              :title="$t('app.btn.reject')"
              variant="text"
              @click="onReject(item)"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </div>

  <EditProgressDialog
    v-if="isShowEditProgressDialog"
    v-model="isShowEditProgressDialog"
    :form="editItem"
    @load="search"
  />
  <EditTypeDialog
    v-if="isMoveReportDialog"
    v-model="isMoveReportDialog"
    :form="editItem"
    @load="search"
  />
  <RejectDialog
    v-if="isRejectDialog"
    v-model="isRejectDialog"
    :form="editItem"
    @load="search"
  />
</template>

<script setup>
  import EditProgressDialog from '@/components/report/EditProgressDialog.vue'
  import EditTypeDialog from '@/components/report/EditTypeDialog.vue'
  import RejectDialog from '@/components/report/RejectDialog.vue'
  import { PRIORITY_OPTIONS, REPORT_TYPE_CODE, REPORT_TYPE_ID, REPORT_TYPE_TITLE, ROLE_NAME, STATUS_ID } from '@/constants'
  import { t } from '@/plugins/i18n'
  import router from '@/router'
  import { useAuthStore, useReportStore } from '@/stores'
  import { isHasRole } from '@/utils/authorization'
  import { debounce } from '@/utils/debounce'
  const { fetchReports, sendRequest, deleteReport } = useReportStore()

  const route = useRoute()
  const instance = getCurrentInstance()
  const { reports } = storeToRefs(useReportStore())
  const { user } = storeToRefs(useAuthStore())
  const title = ref(REPORT_TYPE_TITLE[route.params.type])
  const headers = ref([
    {
      title: t('regulator.fields.id'),
      key: 'id',
      sortable: false,
    },
    { title: t('report.fields.name'), key: 'reprotName', sortable: false },
    { title: t('report.fields.regulator'), key: 'regulatorName', sortable: false },
    { title: t('report.fields.priority'), key: 'priorityChip', sortable: false },
    { title: t('report.fields.progress'), key: 'progressPercentage', sortable: false },
    { title: t('report.fields.startDate'), key: 'start_date', sortable: false },
    { title: t('report.fields.dueDate'), key: 'due_date', sortable: false },
    { title: t('report.fields.creationDate'), key: 'creationDate', sortable: false },
    { title: t('report.fields.user'), key: 'requestedUser', sortable: false },
    { title: t('report.fields.status'), key: 'statusName', sortable: false },
    { title: t('report.fields.requestedAt'), key: 'requestedAt', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
  const copyHeaders = ref(structuredClone(toRaw(headers.value)))
  const filter = ref({
    id: null,
    name: null,
    priority: null,
  })
  const isFilter = ref(false)
  const totalCount = ref(0)
  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
  })
  const isShowEditProgressDialog = ref(false)
  const isMoveReportDialog = ref(false)
  const isRejectDialog = ref(false)
  const isAuditReportType = ref(route.params.type == REPORT_TYPE_CODE.AUDIT)
  const isApprovedType = ref(route.params.type == REPORT_TYPE_CODE.APPROVED)
  const isRejectedType = ref(route.params.type == REPORT_TYPE_CODE.REJECTED)
  const editItem = ref(null)
  const statusIds = ref({
    [REPORT_TYPE_CODE.REQUEST_REVIEW]: STATUS_ID.WAITING_FOR_REVIEW,
    [REPORT_TYPE_CODE.APPROVED]: STATUS_ID.APPROVED,
    [REPORT_TYPE_CODE.REJECTED]: STATUS_ID.REJECTED,
  })
  const isManager = ref(isHasRole(user.value, ROLE_NAME.MANAGER))

  // computed
  const reportType = computed(() => route.params.type)

  // on mounted
  onMounted(() => {
    checkShowHeaders(route.params.type)
  })

  // watch
  watch(reportType, async newReportType => {
    title.value = REPORT_TYPE_TITLE[newReportType]
    isApprovedType.value = newReportType == REPORT_TYPE_CODE.APPROVED
    isRejectedType.value = newReportType == REPORT_TYPE_CODE.REJECTED

    checkShowHeaders(newReportType)

    await clearFilter()
  })

  const onFilterChange = debounce(async () => {
    await search()
  }, 600)

  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { name, id, priority } = filter.value
    const typeId = REPORT_TYPE_ID[reportType.value.toUpperCase()]
    const statusId = statusIds.value[reportType.value] || null

    const { count } = await fetchReports({
      fk_report_type_id: typeId,
      page,
      limit,
      ...(isManager.value && { is_manager: isManager.value }),
      ...(name && { name }),
      ...(id && { id }),
      ...(priority && { priority }),
      ...(statusId && { fk_status_id: statusId }),
    })

    totalCount.value = count
  }
  const clearFilter = async () => {
    filter.value = {
      id: null,
      name: null,
      priority: null,
    }
    await search()
  }
  const onCreate = () => {
    router.push({ name: 'ReportCreate' })
  }
  const onSendRequest = item => {
    instance.root.$confirm({
      title: t('report.confirm.sendRequestReviewTitle'),
      msg: t('report.confirm.sendRequestReviewText'),
      options: { type: 'warning' },
      agree: async () => {
        await sendRequest(item.id, { request_type: 'AUDITOR_REQUEST_REVIEW' })
        instance.root.$notif(t('app.messages.sentSuccess'), { type: 'success' })
        await search()
      },
    })
  }
  const onApprove = item => {
    instance.root.$confirm({
      title: t('report.confirm.approveTitle'),
      msg: t('report.confirm.approveText'),
      options: { type: 'success' },
      agree: async () => {
        await sendRequest(item.id, { request_type: 'MANAGER_APPORVED' })
        instance.root.$notif(t('app.messages.sentSuccess'), { type: 'success' })
        await search()
      },
    })
  }
  const onReject = item => {
    editItem.value = item
    isRejectDialog.value = true
  }
  const onEdit = item => {
    router.push({ name: 'ReportEdit', params: { id: item.id } })
  }
  const onEditProgress = item => {
    editItem.value = item
    isShowEditProgressDialog.value = true
  }
  const onMove = item => {
    editItem.value = item
    isMoveReportDialog.value = true
  }
  const onView = item => {
    router.push({ name: 'ReportReview', params: { id: item.id } })
  }
  const onDelete = id => {
    instance.root.$confirm({
      title: t('app.confirm.deleteTitle'),
      msg: t('app.confirm.deleteText'),
      options: { type: 'error' },
      agree: async () => {
        await deleteReport(id)
        instance.root.$notif(t('app.messages.deleteSuccess'), { type: 'success' })
        await search()
      },
    })
  }
  const checkShowHeaders = reportType => {
    isAuditReportType.value = reportType == REPORT_TYPE_CODE.AUDIT

    const removeHeaders = []
    if (isAuditReportType.value) {
      removeHeaders.push('progressPercentage')
    }

    if ([REPORT_TYPE_CODE.DRAFT, REPORT_TYPE_CODE.PRIMARY].includes(reportType)) {
      removeHeaders.push('statusName')
    }

    if (isManager.value) {
      removeHeaders.push(
        'progressPercentage',
        'priorityChip',
        'start_date',
        'due_date',
        'creationDate',
      )
    } else {
      removeHeaders.push('requestedAt', 'requestedUser')
    }

    headers.value = copyHeaders.value.filter(h => !removeHeaders.includes(h.key))
  }
  const formatDate = dateStr => {
    const date = new Date(dateStr)

    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }

    return new Intl.DateTimeFormat('en-GB', options)
      .format(date)
      .replace(',', '')
  }

  const getStatusColor = item => {
    const colors = {
      [STATUS_ID.WAITING_FOR_REVIEW]: 'warning',
      [STATUS_ID.APPROVED]: 'success',
      [STATUS_ID.REJECTED]: 'error',
    }

    return colors[item.fk_status_id] || 'warning'
  }

  const isDisabledRequestReview = item => {
    return item.fk_status_id == STATUS_ID.APPROVED
  }
</script>

<style scoped>
  .app-wrapper {
    height: 88.5vh;
    display: flex;
    flex-direction: column;
  }
  .bottom {
    flex: 1;
    overflow: auto;
  }
  .progress {
    cursor: pointer;
  }
</style>
