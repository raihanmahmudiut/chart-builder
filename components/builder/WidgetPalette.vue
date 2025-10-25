<template>
  <v-card class="widget-palette" elevation="2">
    <v-card-title class="text-lg font-medium">Widgets</v-card-title>
    <v-card-text class="pa-4">
      <div class="space-y-2">
        <div
          v-for="type in widgetTypes"
          :key="type"
          ref="paletteItemRefs"
          :data-widget-type="type"
          class="palette-item p-3 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-move flex items-center gap-3"
        >
          <v-icon :icon="getWidgetIcon(type)" class="text-gray-600" />
          <span>{{ getWidgetLabel(type) }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { WidgetType } from '~/types/widgets'
import { getWidgetIcon, getWidgetLabel } from '~/types/widgets'

const widgetTypes: WidgetType[] = [
  'line-chart',
  'bar-chart',
  'pie-chart',
  'kpi-card',
  'data-table',
  'text-block',
  'image'
]

const paletteItemRefs = ref<HTMLElement[]>([])

onMounted(async () => {
  await nextTick()
  
  // Setup draggable for each palette item manually
  paletteItemRefs.value.forEach((element) => {
    if (element) {
      const widgetType = element.getAttribute('data-widget-type')
      
      // Set draggable attribute
      element.setAttribute('draggable', 'true')
      
      // Add dragstart event
      element.addEventListener('dragstart', (event: DragEvent) => {
        if (!event.dataTransfer) return
        
        event.dataTransfer.setData('widget-type', widgetType || '')
        event.dataTransfer.effectAllowed = 'copy'
        
        // Create ghost image
        const rect = element.getBoundingClientRect()
        const ghostNode = element.cloneNode(true) as HTMLElement
        ghostNode.style.width = `${rect.width}px`
        ghostNode.style.height = `${rect.height}px`
        ghostNode.style.opacity = '0.7'
        ghostNode.style.position = 'absolute'
        ghostNode.style.top = '-1000px'
        ghostNode.style.backgroundColor = 'rgba(59, 130, 246, 0.5)'
        
        document.body.appendChild(ghostNode)
        event.dataTransfer.setDragImage(ghostNode, rect.width / 2, rect.height / 2)
        setTimeout(() => document.body.removeChild(ghostNode), 0)
      })
    }
  })
})
</script>

<style scoped>
.widget-palette {
  height: fit-content;
}

.palette-item {
  user-select: none;
}
</style>

