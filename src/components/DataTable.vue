<template>
  <v-card height="100%" rounded="4">
    <v-data-table-server
      v-bind="$attrs"
      :disable-sort="display.smAndDown.value"
      :headers="props.headers"
      :items="$attrs.items"
      :items-per-page-text="$t('app.table.itemsPerPage')"
      :loading-text="$t('app.table.loading')"
      :mobile="display.smAndDown.value"
      :no-data-text="$t('app.table.noData')"
    >
      <template v-for="header in props.headers" :key="header.key" #[`item.${header.key}`]="{ item }">
        <p>{{ _.get(item, header.key) }}</p>
        <slot :item="item" :name="`item.${header.key}`" />
      </template>
      <template #[`item.actions`]="{ item }">
        <slot :item="item" name="item.actions" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup>
  import _ from 'lodash'
  import { useDisplay } from 'vuetify'

  const display = useDisplay()
  const props = defineProps({
    headers: {
      type: Array,
      required: true,
    },
  })
</script>

<style scoped>
  ::v-deep(.v-table) {
    height: 100% !important;
  }
  ::v-deep(.v-data-table__thead) {
    background-color: rgb(var(--v-theme-primary), 0.7);
    color: white;
  }
  ::v-deep(.v-data-table-footer) {
    padding-top: 0;
  }
  ::v-deep(.v-table .v-divider) {
    margin: 0;
  }
  ::v-deep(.v-data-table__td-sort-select) {
    display: none;
  }
</style>
