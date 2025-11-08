<template>
  <Notif ref="notif" />
  <AppConfirm ref="confirm" />
  <AppDelay />
  <RouterView />
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import AppConfirm from './lib/components/AppConfirm.vue'
  import AppDelay from './lib/components/AppDelay.vue'
  import Notif from './lib/components/AppNotification.vue'
  import i18n from './plugins/i18n'

  // Variables
  const notif = ref('')
  const confirm = ref('')
  const rootInstance = getCurrentInstance()

  onMounted(() => {
    document.addEventListener('keydown', e => {
      if (e.shiftKey && e.ctrlKey && e.key === 'L') {
        i18n.global.locale = i18n.global.locale === 'en' ? 'kh' : 'en'
      }
    })

    rootInstance.root.$notif = notif.value.pushNotif
    rootInstance.root.$confirm = confirm.value.open
  })
</script>

<style lang="scss" src="./sass/app.scss"></style>
