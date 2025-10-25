<template>
  <div
    ref="wrapperRef"
    class="widget-wrapper absolute bg-white rounded-md shadow-sm border overflow-hidden transition-all duration-200"
    :class="[
      isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-blue-300'
    ]"
    :style="wrapperStyle"
    @click="handleClick"
  >
    <!-- Widget header -->
    <div class="widget-header p-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <v-icon :icon="getWidgetIcon(widget.type)" size="small" class="text-gray-500" />
        <span class="text-sm font-medium truncate">{{ widget.title }}</span>
      </div>
      <div class="flex gap-1">
        <!-- Minimize Button -->
        <v-btn
          icon
          size="x-small"
          variant="text"
          @click.stop="toggleMinimize"
          title="Minimize Widget"
        >
          <v-icon size="small">mdi-minus</v-icon>
        </v-btn>
        <!-- Delete Button -->
        <v-btn
          icon
          size="x-small"
          variant="text"
          color="error"
          @click.stop="deleteWidget"
          title="Delete Widget"
        >
          <v-icon size="small">mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Widget content -->
    <div class="widget-body" :style="{ height: `calc(100% - 48px)` }">
      <WidgetFactory :widget="widget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Widget } from '~/types/widgets'
import { getWidgetIcon } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'
import { useDraggable } from '~/composables/useDraggable'
import { useResizable } from '~/composables/useResizable'
import WidgetFactory from '~/components/widgets/WidgetFactory.vue'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
  cellWidth: number
  cellHeight: number
  gap: number
}>()

const emit = defineEmits<{
  select: []
}>()

const store = useDashboardStore()
const wrapperRef = ref<HTMLElement | null>(null)

const wrapperStyle = computed(() => ({
  left: `${props.widget.x * (props.cellWidth + props.gap)}px`,
  top: `${props.widget.y * (props.cellHeight + props.gap)}px`,
  width: `${props.widget.width * props.cellWidth + (props.widget.width - 1) * props.gap}px`,
  height: `${props.widget.height * props.cellHeight + (props.widget.height - 1) * props.gap}px`,
  zIndex: props.isSelected ? 100 : 1
}))

const handleClick = () => {
  emit('select')
}

const deleteWidget = () => {
  store.removeWidget(props.widget.id)
}

const toggleMinimize = () => {
  store.updateWidget(props.widget.id, { isMinimized: true })
}

onMounted(() => {
  const element = wrapperRef.value
  if (!element) return

  // Setup drag to move widget
  let isDragging = false
  let startX = 0
  let startY = 0
  let initialX = 0
  let initialY = 0

  const handleMouseDown = (e: MouseEvent) => {
    // Only drag from header
    const target = e.target as HTMLElement
    if (!target.closest('.widget-header')) return
    if (target.closest('button')) return // Don't drag when clicking buttons

    isDragging = true
    startX = e.clientX
    startY = e.clientY
    initialX = props.widget.x
    initialY = props.widget.y
    
    document.body.style.cursor = 'move'
    element.style.cursor = 'move'
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    
    const newX = initialX + Math.round(deltaX / (props.cellWidth + props.gap))
    const newY = initialY + Math.round(deltaY / (props.cellHeight + props.gap))
    
    store.updateWidget(props.widget.id, {
      x: Math.max(0, newX),
      y: Math.max(0, newY)
    })
  }

  const handleMouseUp = () => {
    isDragging = false
    document.body.style.cursor = ''
    element.style.cursor = 'move'
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  element.addEventListener('mousedown', handleMouseDown)

  // Setup resize handles
  if (props.isSelected) {
    createResizeHandles()
  }

  function createResizeHandles() {
    const positions = ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']
    
    positions.forEach(pos => {
      const handle = document.createElement('div')
      handle.className = `resize-handle resize-handle-${pos}`
      handle.style.position = 'absolute'
      handle.style.width = '10px'
      handle.style.height = '10px'
      handle.style.backgroundColor = 'rgba(59, 130, 246, 0.5)'
      handle.style.border = '1px solid #3b82f6'
      handle.style.zIndex = '1000'
      
      // Position handles
      switch (pos) {
        case 'se': handle.style.bottom = '0'; handle.style.right = '0'; handle.style.cursor = 'nwse-resize'; break
        case 'sw': handle.style.bottom = '0'; handle.style.left = '0'; handle.style.cursor = 'nesw-resize'; break
        case 'ne': handle.style.top = '0'; handle.style.right = '0'; handle.style.cursor = 'nesw-resize'; break
        case 'nw': handle.style.top = '0'; handle.style.left = '0'; handle.style.cursor = 'nwse-resize'; break
        case 'n': handle.style.top = '0'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; handle.style.cursor = 'ns-resize'; break
        case 's': handle.style.bottom = '0'; handle.style.left = '50%'; handle.style.transform = 'translateX(-50%)'; handle.style.cursor = 'ns-resize'; break
        case 'e': handle.style.right = '0'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; handle.style.cursor = 'ew-resize'; break
        case 'w': handle.style.left = '0'; handle.style.top = '50%'; handle.style.transform = 'translateY(-50%)'; handle.style.cursor = 'ew-resize'; break
      }
      
      handle.addEventListener('mousedown', (e) => handleResizeStart(e, pos))
      element.appendChild(handle)
    })
  }

  function handleResizeStart(e: MouseEvent, position: string) {
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = props.widget.width
    const startHeight = props.widget.height
    
    const handleResizeMove = (e: MouseEvent) => {
      const deltaX = Math.round((e.clientX - startX) / (props.cellWidth + props.gap))
      const deltaY = Math.round((e.clientY - startY) / (props.cellHeight + props.gap))
      
      let newWidth = startWidth
      let newHeight = startHeight
      
      if (position.includes('e')) newWidth += deltaX
      if (position.includes('w')) newWidth -= deltaX
      if (position.includes('s')) newHeight += deltaY
      if (position.includes('n')) newHeight -= deltaY
      
      store.updateWidget(props.widget.id, {
        width: Math.max(1, Math.min(12, newWidth)),
        height: Math.max(1, newHeight)
      })
    }
    
    const handleResizeEnd = () => {
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }
    
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
  }
})
</script>

<style scoped>
.widget-wrapper {
  cursor: move;
}

.widget-header {
  cursor: move;
  user-select: none;
}

.widget-body {
  pointer-events: auto;
  overflow: hidden;
}
</style>

