<template>
  <div
    ref="canvasRef"
    class="dashboard-canvas relative bg-gray-50 border border-gray-200 rounded-lg w-full h-full overflow-auto"
    role="application"
  >
    <!-- Grid background -->
    <div v-if="showGrid && containerWidth > 0" class="absolute inset-0 pointer-events-none">
      <!-- Vertical grid lines -->
      <div
        v-for="i in gridSize + 1"
        :key="`v-${i}`"
        class="absolute top-0 bottom-0 border-r border-dashed border-gray-200"
        :style="{ left: `${(i - 1) * (gridCellWidth + gridGap)}px`, width: '1px' }"
      />
      
      <!-- Horizontal grid lines -->
      <div
        v-for="i in 20"
        :key="`h-${i}`"
        class="absolute left-0 right-0 border-b border-dashed border-gray-200"
        :style="{ top: `${(i - 1) * cellHeight}px`, height: '1px' }"
      />
    </div>

    <!-- Widgets -->
    <WidgetWrapper
      v-for="widget in visibleWidgets"
      :key="widget.id"
      :widget="widget"
      :is-selected="store.selectedWidgetId === widget.id"
      :cell-width="gridCellWidth"
      :cell-height="cellHeight"
      :gap="gridGap"
      @select="selectWidget(widget.id)"
    />

    <!-- Empty state -->
    <div
      v-if="store.widgets.length === 0"
      class="absolute inset-0 flex items-center justify-center text-gray-400"
    >
      <div class="text-center">
        <p class="text-xl">Drag widgets here to build your dashboard</p>
        <p class="text-sm mt-2">Start by dragging a widget from the palette on the left</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { WidgetType } from '~/types/widgets'
import { DEFAULT_WIDGET_HEIGHTS, DEFAULT_WIDGET_WIDTHS, getWidgetLabel } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'
import { useDroppable } from '~/composables/useDroppable'
import WidgetWrapper from './WidgetWrapper.vue'

const store = useDashboardStore()
const canvasRef = ref<HTMLElement | null>(null)

const showGrid = ref(true)
const gridGap = ref(4)
const cellHeight = ref(40)
const containerWidth = ref(0)
const containerHeight = ref(0)

const gridSize = computed(() => store.gridSize)
const visibleWidgets = computed(() => store.visibleWidgets)

const gridCellWidth = computed(() => {
  if (!containerWidth.value) return 0
  return (containerWidth.value - (gridSize.value - 1) * gridGap.value) / gridSize.value
})

const selectWidget = (id: string) => {
  store.selectWidget(id)
}

const handleWidgetDrop = (detail: any) => {
  const widgetType = detail.getData('widget-type') as WidgetType
  if (!widgetType) return

  // Calculate grid position from pixel coordinates
  const gridX = Math.floor(detail.x / (gridCellWidth.value + gridGap.value))
  const gridY = Math.floor(detail.y / cellHeight.value)

  // Create new widget
  const newWidget = {
    id: crypto.randomUUID(),
    type: widgetType,
    title: `New ${getWidgetLabel(widgetType)}`,
    x: Math.max(0, Math.min(gridX, gridSize.value - 1)),
    y: Math.max(0, gridY),
    width: DEFAULT_WIDGET_WIDTHS[widgetType] || 3,
    height: DEFAULT_WIDGET_HEIGHTS[widgetType] || 2,
    dataMapping: {},
    settings: widgetType === 'kpi-card' ? {
      value: 12500,
      target: 15000,
      format: 'currency',
      trend: 8.5
    } : {}
  }

  store.addWidget(newWidget)
}

onMounted(() => {
  const element = canvasRef.value
  if (!element) return

  // Setup drop handlers manually
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
    element.classList.add('drop-active')
  }

  const handleDragLeave = () => {
    element.classList.remove('drop-active')
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    element.classList.remove('drop-active')
    
    const widgetType = event.dataTransfer?.getData('widget-type') as WidgetType
    if (!widgetType) return

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    handleWidgetDrop({ getData: (key: string) => event.dataTransfer?.getData(key) || null, x, y })
  }

  element.addEventListener('dragover', handleDragOver)
  element.addEventListener('dragleave', handleDragLeave)
  element.addEventListener('drop', handleDrop)

  // Measure container
  useResizeObserver(canvasRef, (entries) => {
    const entry = entries[0]
    containerWidth.value = entry.contentRect.width
    containerHeight.value = entry.contentRect.height
  })
})
</script>

<style scoped>
.dashboard-canvas {
  position: relative;
  min-height: 100%;
}

/* Custom scrollbar for canvas */
.dashboard-canvas::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.dashboard-canvas::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dashboard-canvas::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dashboard-canvas::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

