<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    :rail="props.rail"
    width="230"
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
      <template v-for="menu in menus" :key="menu.title">

        <!-- No children -->
        <v-list-item
          v-if="!menu.children"
          color="primary"
          :prepend-icon="menu.icon"
          :title="menu.title"
          :to="menu.link"
        />

        <!-- Has children -->
        <v-list-group
          v-else
          color="primary"
          :value="menu.title"
        >
          <template #activator="{ props: itemProps }">
            <v-list-item
              v-bind="itemProps"
              :prepend-icon="menu.icon"
              :title="menu.title"
            />
          </template>

          <v-list-item
            v-for="child in menu.children"
            :key="child.title"
            color="primary"
            :title="child.title"
            :to="child.link"
          />
        </v-list-group>

      </template>
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
      {
        title: t('app.nav.reports'),
        icon: 'mdi-file-chart',
        permission: PERMISSION_NAME.REPORTS,
        children: [
          {
            link: '/report/draft',
            title: t('app.nav.draftAuditReport'),
          },
          {
            link: '/report/primary',
            title: t('app.nav.primaryAuditReport'),
          },
          {
            link: '/report/audit',
            title: t('app.nav.auditReport'),
          },
        ],
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
