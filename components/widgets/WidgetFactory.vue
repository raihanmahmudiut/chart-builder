<template>
  <div class="widget-content h-full w-full overflow-hidden">
    <ChartWidget v-if="isChartType" :widget="widget" />
    <KpiCard v-else-if="widget.type === 'kpi-card'" :widget="widget" />
    <DataTableWidget v-else-if="widget.type === 'data-table'" :widget="widget" />
    <TextBlockWidget v-else-if="widget.type === 'text-block'" :widget="widget" />
    <ImageWidget v-else-if="widget.type === 'image'" :widget="widget" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '~/types/widgets'
import ChartWidget from './ChartWidget.vue'
import KpiCard from './KpiCard.vue'
import DataTableWidget from './DataTableWidget.vue'
import TextBlockWidget from './TextBlockWidget.vue'
import ImageWidget from './ImageWidget.vue'

const props = defineProps<{
  widget: Widget
}>()

const isChartType = computed(() =>
  ['line-chart', 'bar-chart', 'pie-chart'].includes(props.widget.type)
)
</script>
