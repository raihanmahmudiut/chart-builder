<template>
  <div class="text-block-container h-full w-full p-4 overflow-auto">
    <div
      ref="contentRef"
      class="text-block-content h-full w-full outline-none whitespace-pre-wrap"
      :class="isDark ? 'text-gray-200' : 'text-gray-800'"
      contenteditable="true"
      @blur="handleBlur"
      @input="handleInput"
      v-text="widget.settings?.content || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Widget } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'

const props = defineProps<{ widget: Widget }>()
const store = useDashboardStore()
const contentRef = ref<HTMLElement | null>(null)
const isDark = computed(() => store.theme === 'dark')

function handleInput() {
  // live update while typing — no history push to avoid spam
}

function handleBlur() {
  const text = contentRef.value?.textContent ?? ''
  if (text !== props.widget.settings?.content) {
    store.updateWidgetWithHistory(props.widget.id, {
      settings: { ...props.widget.settings, content: text },
    })
  }
}
</script>

<style scoped>
.text-block-content {
  font-size: 14px;
  line-height: 1.6;
  min-height: 60px;
  cursor: text;
}
</style>
