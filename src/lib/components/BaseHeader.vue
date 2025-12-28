<template>
  <div class="d-flex justify-space-between align-center mb-2" :class="{'flex-column': display.smAndDown.value}">
    <h3>{{ props.title }}</h3>
    <div :class="{'mt-2': display.smAndDown.value}">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify'

  const display = useDisplay()
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
  })
</script>
