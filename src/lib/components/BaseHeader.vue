<template>
  <div class="d-flex justify-space-between align-center mb-2">
    <h3>{{ props.title }}</h3>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
  })
</script>
