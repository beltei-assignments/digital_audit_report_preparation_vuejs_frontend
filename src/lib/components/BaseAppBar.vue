<template>
  <v-card class="bg-white" height="8vh" rounded="4">
    <div
      :class="`h-100 w-100 pa-3 d-flex align-center justify-space-between ${props.class}`"
    >
      <v-icon-btn icon="mdi-menu" @click="clickMenu" />
      <div class="w-50">
        <slot />
      </div>
      <div>
        <v-menu min-width="200px" rounded>
          <template #activator="{ props: propsMenu }">
            <v-btn
              icon
              v-bind="propsMenu"
              size="small"
            >
              <v-avatar
                color="primary"
              >
                <span class="text-h6">{{ shortName }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>

              <div class="mx-auto text-center">
                <v-avatar
                  color="primary"
                >
                  <span class="text-h5">CT</span>
                </v-avatar>
                <h3>{{ fullName }}</h3>
                <p class="text-caption mt-1">
                  {{ email }}
                </p>
                <v-divider class="my-1" />
                <v-menu>
                  <template #activator="{ props: menuProps }">
                    <v-btn v-bind="menuProps" append-icon="mdi-menu-down" class="text-none" variant="text">
                      {{ $t(`app.lang.${i18n.global.locale.value}`) }}
                    </v-btn>
                  </template>
                  <v-list @update:selected="changeLanguage">
                    <v-list-item value="kh">
                      <v-list-item-title>{{ $t('app.lang.kh') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="en">
                      <v-list-item-title>{{ $t('app.lang.en') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-divider class="my-1" />
                <v-btn
                  class="text-none"
                  variant="text"
                  @click="disconnect"
                >
                  {{ $t('auth.logout') }}
                </v-btn>
              </div>

            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-card>
</template>

<script setup>
  import i18n from '@/plugins/i18n'
  import { useAuthStore } from '@/stores'

  const authStore = useAuthStore()
  const { user } = storeToRefs(useAuthStore())
  const router = useRouter()
  const props = defineProps(['title', 'class'])
  const emit = defineEmits(['click-menu'])
  const clickMenu = () => {
    emit('click-menu')
  }

  const shortName = computed(() => {
    if (!user.value.data) {
      return ''
    }

    return user.value.data.first_name[0].toUpperCase() + user.value.data.last_name[0].toUpperCase()
  })
  const fullName = computed(() => {
    if (!user.value.data) {
      return ''
    }

    return `${user.value.data.first_name} ${user.value.data.last_name}`
  })

  const email = computed(() => {
    if (!user.value.data) {
      return ''
    }

    return user.value.data.email
  })

  const disconnect = () => {
    authStore.disconnect()
    router.push({ name: 'Login' })
  }

  const changeLanguage = ([locale]) => {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)

    window.location.reload()
  }
</script>
