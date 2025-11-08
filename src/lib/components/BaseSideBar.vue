<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    :rail="props.rail"
  >
    <v-list>
      <v-list-item
        :title="appTitile"
      >
        <template #prepend>
          <v-img class="mr-7" :src="logo" :width="26" />
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="menu in menus"
        :key="menu.title"
        color="primary"
        :prepend-icon="menu.icon"
        :title="menu.title"
        :to="menu.link"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import logo from '@/assets/images/logo.png'
  import { PERMISSION_NAME } from '@/constants/index.js'
  import { t } from '@/plugins/i18n'
  import { useAuthStore } from '@/stores'

  const props = defineProps({
    rail: {
      type: Boolean,
      required: true,
    },
  })
  const appTitile = ref('AuditPro')
  const drawer = ref(true)
  const { user } = storeToRefs(useAuthStore())

  const menus = computed(() => {
    const defaultMenus = [
      {
        link: '/home',
        title: t('app.nav.home'),
        icon: 'mdi-home-analytics',
        permission: PERMISSION_NAME.DASHBOARD,
      },
      {
        link: '/cashier',
        title: 'Recipt',
        icon: 'mdi-storefront-plus',
        permission: PERMISSION_NAME.RECIPT,
      },
      {
        link: '/chef',
        title: 'Cook',
        icon: 'mdi-storefront-plus',
        permission: PERMISSION_NAME.COOK,
      },
      {
        link: '/product',
        title: t('app.nav.product'),
        icon: 'mdi-cube-outline',
        permission: PERMISSION_NAME.PRODUCT,
      },
      {
        link: '/category',
        title: t('app.nav.category'),
        icon: 'mdi-shape-plus-outline',
        permission: PERMISSION_NAME.CATEGORY,
      },
      {
        link: '/table',
        title: t('app.nav.table'),
        icon: 'mdi-table-chair',
        permission: PERMISSION_NAME.TABLE,
      },
      {
        link: '/staff',
        title: t('app.nav.staff'),
        icon: 'mdi-account-group-outline',
        permission: PERMISSION_NAME.USER,
      },
      {
        link: '/sale',
        title: t('app.nav.sale'),
        icon: 'mdi-chart-bar',
        permission: PERMISSION_NAME.SALE,
      },
      {
        link: '/money',
        title: t('app.nav.money'),
        icon: 'mdi-finance',
        permission: PERMISSION_NAME.MONEY,
      },
    ]

    return defaultMenus.filter(
      ({ permission }) =>
        !!user.value.permissions.some(
          per => per.code == permission && per.read,
        ),
    )
  })
</script>
