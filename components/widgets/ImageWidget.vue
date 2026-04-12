<template>
  <div class="image-container h-full w-full flex items-center justify-center overflow-hidden">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="widget.title"
      class="w-full h-full"
      :style="{ objectFit: objectFit as 'contain' | 'cover' | 'fill' }"
      @error="handleError"
    />
    <div v-else class="text-center text-gray-400">
      <v-icon size="large" class="mb-2">mdi-image-off</v-icon>
      <p class="text-sm">No image URL set</p>
      <p class="text-xs mt-1">Add an image URL in the properties panel</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Widget } from '~/types/widgets'

const props = defineProps<{ widget: Widget }>()

const loadError = ref(false)

const imageUrl = computed(() => {
  if (loadError.value) return ''
  return props.widget.settings?.imageUrl || ''
})

const objectFit = computed(() => (props.widget.settings?.objectFit as string) || 'contain')

function handleError() {
  loadError.value = true
}
</script>

<style scoped>
.image-container {
  min-height: 100px;
}
</style>
