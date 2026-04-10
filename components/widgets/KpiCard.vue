<template>
  <div class="kpi-container h-full flex flex-col justify-center items-center p-4">
    <div class="kpi-value text-4xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">
      {{ formatValue(value) }}
    </div>

    <div
      v-if="target > 0"
      class="kpi-target text-sm mb-2"
      :class="isDark ? 'text-gray-300' : 'text-gray-600'"
    >
      Target: {{ formatValue(target) }}
    </div>

    <div
      v-if="trend !== 0"
      class="kpi-trend flex items-center gap-1 px-2 py-1 rounded text-sm"
      :class="trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
    >
      <span class="trend-arrow text-base">{{ trend > 0 ? '\u2191' : '\u2193' }}</span>
      <span class="trend-value font-medium">{{ Math.abs(trend) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'

const props = defineProps<{
  widget: Widget
}>()

const store = useDashboardStore()
const isDark = computed(() => store.theme === 'dark')

const dataRow = computed(() => {
  if (!props.widget.dataSourceId) return null
  const ds = store.getDataSourceById(props.widget.dataSourceId)
  return ds?.data?.[0] ?? null
})

const value = computed(() => {
  if (dataRow.value && props.widget.settings?.valueColumn) {
    return Number(dataRow.value[props.widget.settings.valueColumn]) || 0
  }
  return props.widget.settings?.value ?? 0
})

const target = computed(() => {
  if (dataRow.value && props.widget.settings?.targetColumn) {
    return Number(dataRow.value[props.widget.settings.targetColumn]) || 0
  }
  return props.widget.settings?.target ?? 0
})

const trend = computed(() => {
  if (dataRow.value && props.widget.settings?.trendColumn) {
    return Number(dataRow.value[props.widget.settings.trendColumn]) || 0
  }
  return props.widget.settings?.trend ?? 0
})

const format = computed(() => props.widget.settings?.format || 'number')

function formatValue(val: number): string {
  switch (format.value) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    case 'percent':
      return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(
        val / 100
      )
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
