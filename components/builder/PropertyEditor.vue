<template>
  <v-card class="property-editor" elevation="2">
    <v-card-title class="text-lg font-medium">Properties</v-card-title>
    <v-card-text class="pa-4">
      <div v-if="selectedWidget" class="space-y-4">
        <!-- Widget Title -->
        <v-text-field
          v-model="widgetTitle"
          label="Widget Title"
          variant="outlined"
          density="compact"
          @update:model-value="updateTitle"
        />

        <!-- Position and Size -->
        <div class="grid grid-cols-2 gap-3">
          <v-text-field
            v-model.number="widgetX"
            label="X Position"
            type="number"
            variant="outlined"
            density="compact"
            min="0"
            @update:model-value="updateProperty('x', $event)"
          />

          <v-text-field
            v-model.number="widgetY"
            label="Y Position"
            type="number"
            variant="outlined"
            density="compact"
            min="0"
            @update:model-value="updateProperty('y', $event)"
          />

          <v-text-field
            v-model.number="widgetWidth"
            label="Width"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
            max="12"
            @update:model-value="updateProperty('width', $event)"
          />

          <v-text-field
            v-model.number="widgetHeight"
            label="Height"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
            @update:model-value="updateProperty('height', $event)"
          />
        </div>

        <!-- Widget Type (read-only) -->
        <v-text-field
          :model-value="widgetTypeLabel"
          label="Widget Type"
          variant="outlined"
          density="compact"
          readonly
          disabled
        />
      </div>

      <div v-else class="text-gray-500 text-sm">
        <p>No widget selected</p>
        <p class="mt-2">Select a widget on the canvas to edit its properties</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDashboardStore } from '~/stores/dashboard'
import { getWidgetLabel } from '~/types/widgets'

const store = useDashboardStore()

const selectedWidget = computed(() => store.selectedWidget)

const widgetTitle = ref('')
const widgetX = ref(0)
const widgetY = ref(0)
const widgetWidth = ref(1)
const widgetHeight = ref(1)

const widgetTypeLabel = computed(() => {
  if (!selectedWidget.value) return ''
  return getWidgetLabel(selectedWidget.value.type)
})

// Watch for widget selection changes
watch(selectedWidget, (widget) => {
  if (widget) {
    widgetTitle.value = widget.title
    widgetX.value = widget.x
    widgetY.value = widget.y
    widgetWidth.value = widget.width
    widgetHeight.value = widget.height
  }
}, { immediate: true })

const updateTitle = (value: string) => {
  if (selectedWidget.value) {
    store.updateWidget(selectedWidget.value.id, { title: value })
  }
}

const updateProperty = (property: 'x' | 'y' | 'width' | 'height', value: number) => {
  if (selectedWidget.value) {
    store.updateWidget(selectedWidget.value.id, { [property]: value })
  }
}
</script>

<style scoped>
.property-editor {
  height: fit-content;
}
</style>

