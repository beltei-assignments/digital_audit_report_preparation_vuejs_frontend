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
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="filter.name"
              clearable
              density="compact"
              hide-details="auto"
              :label="$t('regulator.fields.name')"
              variant="outlined"
              @update:model-value="search"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="filter.priority"
              clearable
              density="compact"
              hide-details="auto"
              :items="PRIORITY_OPTIONS"
              :label="$t('report.fields.priority')"
              variant="outlined"
              @update:model-value="search"
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
        <template #[`item.regulatorName`]="{ item }">
          {{ item.regulator.name }}
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
          <v-chip class="text-capitalize" color="primary" variant="flat">
            {{ item.status.name }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon-btn
            color="info"
            icon="mdi-file-move"
            variant="text"
          />
          <v-icon-btn
            color="warning"
            icon="mdi-pencil"
            variant="text"
            @click="onEdit(item)"
          />
          <v-icon-btn
            color="error"
            icon="mdi-delete"
            variant="text"
            @click="onDelete(item.id)"
          />
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
</template>

<script setup>
  import EditProgressDialog from '@/components/report/EditProgressDialog.vue'
  import { PRIORITY_OPTIONS, REPORT_TYPE_CODE, REPORT_TYPE_ID, REPORT_TYPE_TITLE } from '@/constants'
  import { t } from '@/plugins/i18n'
  import router from '@/router'
  import { useReportStore } from '@/stores'
  const { fetchReports, deleteReport } = useReportStore()

  const route = useRoute()
  const instance = getCurrentInstance()
  const { reports } = storeToRefs(useReportStore())
  const title = ref(REPORT_TYPE_TITLE[route.params.type])
  const headers = ref([
    {
      title: t('regulator.fields.id'),
      key: 'id',
      sortable: false,
    },
    { title: t('report.fields.name'), key: 'name', sortable: false },
    { title: t('report.fields.regulator'), key: 'regulatorName', sortable: false },
    { title: t('report.fields.priority'), key: 'priorityChip', sortable: false },
    { title: t('report.fields.progress'), key: 'progressPercentage', sortable: false },
    { title: t('report.fields.startDate'), key: 'start_date', sortable: false },
    { title: t('report.fields.dueDate'), key: 'due_date', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ])
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
  const editItem = ref(null)

  // computed
  const reportType = computed(() => route.params.type)

  // on mounted
  onMounted(() => {
    checkShowStatus(route.params.type)
  })

  // watch
  watch(reportType, async newReportType => {
    title.value = REPORT_TYPE_TITLE[newReportType]

    checkShowStatus(newReportType)

    await clearFilter()
  })

  const search = async () => {
    const { page, itemsPerPage: limit } = options.value
    const { name, id, priority } = filter.value
    const typeId = REPORT_TYPE_ID[reportType.value.toUpperCase()]

    const { count } = await fetchReports({
      fk_report_type_id: typeId,
      page, limit,
      ...(name && { name }),
      ...(id && { id }),
      ...(priority && { priority }) })

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
  const onEdit = item => {
    router.push({ name: 'ReportEdit', params: { id: item.id } })
  }
  const onEditProgress = item => {
    editItem.value = item
    isShowEditProgressDialog.value = true
  }
  const onDelete = id => {
    instance.root.$confirm({
      title: t('app.confirm.deleteTitle'),
      msg: t('app.confirm.deleteText'),
      agree: async () => {
        await deleteReport(id)
        instance.root.$notif(t('app.messages.deleteSuccess'), { type: 'success' })
        await search()
      },
    })
  }
  const checkShowStatus = reportType => {
    const isShowStatus = reportType == REPORT_TYPE_CODE.AUDIT
    headers.value = isShowStatus
      ? [
        {
          title: t('regulator.fields.id'),
          key: 'id',
          sortable: false,
        },
        { title: t('report.fields.name'), key: 'name', sortable: false },
        { title: t('report.fields.regulator'), key: 'regulatorName', sortable: false },
        { title: t('report.fields.priority'), key: 'priorityChip', sortable: false },
        { title: t('report.fields.progress'), key: 'progressPercentage', sortable: false },
        { title: t('report.fields.startDate'), key: 'start_date', sortable: false },
        { title: t('report.fields.dueDate'), key: 'due_date', sortable: false },
        { title: t('report.fields.status'), key: 'statusName', sortable: false },
        { title: '', key: 'actions', sortable: false, align: 'end' },
      ]
      : headers.value.filter(h => h.key !== 'statusName')
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
