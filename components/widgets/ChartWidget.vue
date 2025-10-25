<template>
  <div class="chart-container h-full w-full p-4">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import type { Widget } from '~/types/widgets'

const props = defineProps<{
  widget: Widget
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Chart colors
const chartColors = {
  background: [
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)'
  ],
  border: [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)'
  ]
}

// Generate demo data based on widget type
const generateChartData = () => {
  let demoData

  switch (props.widget.type) {
    case 'pie-chart':
      demoData = {
        labels: ['Product Sales', 'Services', 'Subscriptions', 'Consulting', 'Training'],
        data: [45000, 32000, 28000, 18000, 15000]
      }
      break
    case 'bar-chart':
      demoData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [28000, 35000, 42000, 48000]
      }
      break
    case 'line-chart':
    default:
      demoData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 19000, 15000, 25000, 22000, 30000]
      }
      break
  }

  return {
    labels: demoData.labels,
    datasets: [{
      label: props.widget.title,
      data: demoData.data,
      backgroundColor: props.widget.type === 'pie-chart'
        ? chartColors.background
        : chartColors.background[0],
      borderColor: props.widget.type === 'pie-chart'
        ? chartColors.border
        : chartColors.border[0],
      borderWidth: 1,
      tension: props.widget.type === 'line-chart' ? 0.4 : undefined
    }]
  }
}

// Generate chart options
const generateChartOptions = () => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    },
    plugins: {
      legend: {
        display: props.widget.settings?.showLegend ?? true,
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: props.widget.title,
        padding: {
          top: 10,
          bottom: 20
        },
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    }
  }

  const typeSpecificOptions = props.widget.type === 'pie-chart' ? {
    plugins: {
      ...baseOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  } : {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: props.widget.yAxis || 'Value'
        }
      },
      x: {
        title: {
          display: true,
          text: props.widget.xAxis || 'Time'
        }
      }
    }
  }

  return { ...baseOptions, ...typeSpecificOptions, ...props.widget.settings }
}

const chartConfig = computed(() => ({
  type: props.widget.type.replace('-chart', '') as 'line' | 'bar' | 'pie',
  data: generateChartData(),
  options: generateChartOptions()
}))

const updateChart = () => {
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
  if (chart) {
    chart.destroy()
  }
})

watch(() => [props.widget.settings, props.widget.title], () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  min-height: 200px;
}
</style>

