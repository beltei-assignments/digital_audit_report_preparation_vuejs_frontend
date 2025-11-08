<template>
  <v-layout>
    <BaseSideBar :rail="rail" />

    <v-main class="mx-2 mt-2">
      <BaseAppBar @click-menu=" rail = !rail" />
      <main class="d-flex flex-column mt-2">
        <RouterView />
      </main>
    </v-main>
  </v-layout>
</template>

<script setup>
  import BaseAppBar from '@/lib/components/BaseAppBar.vue'
  import BaseSideBar from '@/lib/components/BaseSideBar.vue'

  const rail = ref(false)
</script>
