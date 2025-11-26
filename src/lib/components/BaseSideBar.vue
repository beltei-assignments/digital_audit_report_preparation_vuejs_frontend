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
        link: '/regulator',
        title: t('app.nav.regulator'),
        icon: 'mdi-office-building-cog-outline',
        permission: PERMISSION_NAME.REGULATORS,
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
