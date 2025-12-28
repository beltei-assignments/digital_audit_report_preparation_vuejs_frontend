<template>
  <v-layout :class="display.smAndDown.value ? 'mr-4' : 'mr-2'">
    <BaseSideBar v-model:rail="rail" />

    <v-main class="ml-2 mt-2">
      <BaseAppBar @click-menu=" rail = !rail" />
      <main class="d-flex flex-column mt-2">
        <RouterView />
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import { useDisplay } from 'vuetify'
  import BaseAppBar from '@/lib/components/BaseAppBar.vue'
  import BaseSideBar from '@/lib/components/BaseSideBar.vue'

  const display = useDisplay()
  const rail = ref(false)
</script>
