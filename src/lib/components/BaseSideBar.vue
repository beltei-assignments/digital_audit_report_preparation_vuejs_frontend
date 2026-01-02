<template>
  <v-navigation-drawer
    mobile-breakpoint="md"
    :model-value="(display.mdAndDown.value && props.rail) || display.mdAndUp.value"
    :permanent="display.mdAndUp.value"
    :rail="props.rail && display.mdAndUp.value"
    :temporary="display.mdAndDown.value"
    width="240"
    @update:model-value="changeRail"
  >
    <v-list>
      <v-list-item>
        <template #prepend>
          <v-img class="mr-7 cursor-pointer" :src="logo" :width="26" @click="$router.push({name: 'Home'})" />
        </template>
        <template #title>
          <h4 class="cursor-pointer" @click="$router.push({name: 'Home'})">{{ appTitile }}</h4>
        </template>
        <template v-if="display.smAndDown.value" #append>
          <v-icon-btn icon="mdi-close" @click="changeRail" />
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
  import { useDisplay } from 'vuetify'
  import logo from '@/assets/images/logo.png'
  import { PERMISSION_NAME, ROLE_NAME } from '@/constants/index.js'
  import { t } from '@/plugins/i18n'
  import { useAuthStore } from '@/stores'
  import { isHasRole } from '@/utils/authorization'

  const display = useDisplay()
  const props = defineProps({
    rail: {
      type: Boolean,
      required: true,
    },
  })
  const emit = defineEmits(['update:rail'])
  const appTitile = ref('AuditPro')
  // const drawer = ref(true)
  const { user } = storeToRefs(useAuthStore())

  const defaultMenus = ref([
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
      children: [
        {
          link: '/report/draft',
          title: t('app.nav.draftAuditReport'),
          permission: PERMISSION_NAME.REPORTS,
        },
        {
          link: '/report/primary',
          title: t('app.nav.primaryAuditReport'),
          permission: PERMISSION_NAME.REPORTS,
        },
        {
          link: '/report/audit',
          title: t('app.nav.auditReport'),
          permission: PERMISSION_NAME.REPORTS,
        },
        {
          link: '/report/request-review',
          title: t('app.nav.requestReview'),
          permission: PERMISSION_NAME.REPORTS_APPROVAL,
        },
        {
          link: '/report/approved',
          title: t('app.nav.approved'),
          permission: PERMISSION_NAME.REPORTS_APPROVAL,
        },
        {
          link: '/report/rejected',
          title: t('app.nav.rejected'),
          permission: PERMISSION_NAME.REPORTS_APPROVAL,
        },
      ],
    },
    {
      link: '/profile',
      title: t('app.nav.profile'),
      icon: 'mdi-account-circle-outline',
    },
  ])

  const menus = computed(() => {
    if (isHasRole(user.value, ROLE_NAME.ADMINISTRATOR)) {
      return [
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
          link: '/profile',
          title: t('app.nav.profile'),
          icon: 'mdi-account-circle-outline',
        },
      ]
    }

    return defaultMenus.value
      .filter(menu => checkPermissionsShow(menu))
      .map(menu => {
        // deep clone menu to avoid mutating original
        const newMenu = { ...menu }

        // if it has children, filter them too
        if (menu.children) {
          newMenu.children = menu.children.filter(ch =>
            checkPermissionsShow(ch),
          )
        }

        return newMenu
      })
  })

  const checkPermissionsShow = menu => {
    if (!menu.permission) return true

    return !!user.value.permissions.some(
      per => per.code == menu.permission && per.read,
    )
  }

  const changeRail = () => {
    emit('update:rail', !props.rail)
  }
</script>

<style scoped>
  ::v-deep(.v-list-item__prepend) {
    width: 40px;
  }
  ::v-deep(.v-list-group__items > .v-list-item) {
    padding-left: 48px !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
