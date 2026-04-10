<template>
  <div class="chart-container h-full w-full p-4">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import type { Widget } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'

const props = defineProps<{
  widget: Widget
}>()

const store = useDashboardStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const COLORS = {
  bg: [
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(199, 199, 199, 0.5)',
  ],
  border: [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
  ],
}

const DEMO: Record<string, { labels: string[]; data: number[] }> = {
  'pie-chart': {
    labels: ['Product Sales', 'Services', 'Subscriptions', 'Consulting', 'Training'],
    data: [45000, 32000, 28000, 18000, 15000],
  },
  'bar-chart': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [28000, 35000, 42000, 48000],
  },
  'line-chart': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12000, 19000, 15000, 25000, 22000, 30000],
  },
}

function buildChartData() {
  const ds = props.widget.dataSourceId
    ? store.getDataSourceById(props.widget.dataSourceId)
    : undefined

  const labelCol = props.widget.settings?.labelField || props.widget.settings?.xAxis
  const valueCol = props.widget.settings?.valueField || props.widget.settings?.yAxis

  if (ds && labelCol && valueCol) {
    const labels = ds.data.map((row) => String(row[labelCol] ?? ''))
    const values = ds.data.map((row) => Number(row[valueCol]) || 0)
    const isPie = props.widget.type === 'pie-chart'

    return {
      labels,
      datasets: [
        {
          label: props.widget.title,
          data: values,
          backgroundColor: isPie ? COLORS.bg.slice(0, labels.length) : COLORS.bg[0],
          borderColor: isPie ? COLORS.border.slice(0, labels.length) : COLORS.border[0],
          borderWidth: 1,
          tension: props.widget.type === 'line-chart' ? 0.4 : undefined,
        },
      ],
    }
  }

  const demo = DEMO[props.widget.type] || DEMO['line-chart']
  const isPie = props.widget.type === 'pie-chart'
  return {
    labels: demo.labels,
    datasets: [
      {
        label: props.widget.title,
        data: demo.data,
        backgroundColor: isPie ? COLORS.bg : COLORS.bg[0],
        borderColor: isPie ? COLORS.border : COLORS.border[0],
        borderWidth: 1,
        tension: props.widget.type === 'line-chart' ? 0.4 : undefined,
      },
    ],
  }
}

function buildChartOptions() {
  const base: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 750, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        display: props.widget.settings?.showLegend ?? true,
        position: 'top',
        labels: { padding: 20, usePointStyle: true },
      },
      title: {
        display: true,
        text: props.widget.title,
        padding: { top: 10, bottom: 20 },
        font: { size: 16, weight: 'bold' },
      },
    },
  }

  if (props.widget.type === 'pie-chart') {
    base.plugins.tooltip = {
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = ((ctx.raw / total) * 100).toFixed(1)
          return `${ctx.label}: ${ctx.raw} (${pct}%)`
        },
      },
    }
  } else {
    base.scales = {
      y: {
        beginAtZero: true,
        title: { display: true, text: props.widget.settings?.yAxisLabel || 'Value' },
      },
      x: {
        title: { display: true, text: props.widget.settings?.xAxisLabel || 'Category' },
      },
    }
  }

  return base
}

const chartConfig = computed(() => ({
  type: props.widget.type.replace('-chart', '') as 'line' | 'bar' | 'pie',
  data: buildChartData(),
  options: buildChartOptions(),
}))

function rebuildChart() {
  if (chart) {
    chart.data = chartConfig.value.data
    chart.options = chartConfig.value.options as any
    chart.update('none')
  }
}

onMounted(() => {
  if (canvasRef.value) {
    chart = new Chart(canvasRef.value, chartConfig.value)
  }
})

onUnmounted(() => {
  chart?.destroy()
})

watch(() => [props.widget.settings, props.widget.title, props.widget.dataSourceId], rebuildChart, {
  deep: true,
})
</script>

<style scoped>
.chart-container {
  min-height: 200px;
}
</style>
