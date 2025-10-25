<template>
  <div class="widget-content h-full w-full overflow-hidden">
    <ChartWidget v-if="isChartType" :widget="widget" />
    <KpiCard v-else-if="widget.type === 'kpi-card'" :widget="widget" />
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      <p>{{ widget.type }} - Coming soon</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '~/types/widgets'
import ChartWidget from './ChartWidget.vue'
import KpiCard from './KpiCard.vue'

const props = defineProps<{
  widget: Widget
}>()

const isChartType = computed(() => 
  ['line-chart', 'bar-chart', 'pie-chart'].includes(props.widget.type)
)
</script>

