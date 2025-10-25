<template>
  <div class="kpi-container h-full flex flex-col justify-center items-center p-4">
    <div class="kpi-value text-4xl font-bold text-gray-800 mb-2">
      {{ formatValue(value) }}
    </div>

    <div v-if="target > 0" class="kpi-target text-sm text-gray-600 mb-2">
      Target: {{ formatValue(target) }}
    </div>

    <div
      v-if="trend !== 0"
      class="kpi-trend flex items-center gap-1 px-2 py-1 rounded text-sm"
      :class="trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
    >
      <span class="trend-arrow text-base">
        {{ trend > 0 ? '↑' : '↓' }}
      </span>
      <span class="trend-value font-medium">{{ Math.abs(trend) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '~/types/widgets'

const props = defineProps<{
  widget: Widget
}>()

const value = computed(() => props.widget.settings?.value || 0)
const target = computed(() => props.widget.settings?.target || 0)
const format = computed(() => props.widget.settings?.format || 'number')
const trend = computed(() => props.widget.settings?.trend || 0)

const formatValue = (val: number): string => {
  switch (format.value) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val)
    case 'percent':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1
      }).format(val / 100)
    default:
      return new Intl.NumberFormat('en-US').format(val)
  }
}
</script>

<style scoped>
.kpi-container {
  min-height: 150px;
}
</style>

