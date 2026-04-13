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
            @update:model-value="updateProperty('x', Number($event))"
          />
          <v-text-field
            v-model.number="widgetY"
            label="Y Position"
            type="number"
            variant="outlined"
            density="compact"
            min="0"
            @update:model-value="updateProperty('y', Number($event))"
          />
          <v-text-field
            v-model.number="widgetWidth"
            label="Width"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
            max="12"
            @update:model-value="updateProperty('width', Number($event))"
          />
          <v-text-field
            v-model.number="widgetHeight"
            label="Height"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
            @update:model-value="updateProperty('height', Number($event))"
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

        <v-divider />

        <!-- Data Source Selector (for data-driven widgets) -->
        <template v-if="isDataDriven">
          <h4 class="text-sm font-medium">Data Source</h4>
          <v-select
            :model-value="selectedWidget.dataSourceId || ''"
            :items="dataSourceItems"
            item-title="text"
            item-value="value"
            label="Select Data Source"
            variant="outlined"
            density="compact"
            clearable
            @update:model-value="updateDataSource"
          />

          <!-- Column Mapping — Chart -->
          <template v-if="isChartType && selectedColumns.length > 0">
            <v-select
              :model-value="
                selectedWidget.settings?.labelField || selectedWidget.settings?.xAxis || ''
              "
              :items="selectedColumns"
              :label="selectedWidget.type === 'pie-chart' ? 'Label Column' : 'X-Axis Column'"
              variant="outlined"
              density="compact"
              @update:model-value="
                updateSetting(selectedWidget.type === 'pie-chart' ? 'labelField' : 'xAxis', $event)
              "
            />
            <v-select
              :model-value="
                selectedWidget.settings?.valueField || selectedWidget.settings?.yAxis || ''
              "
              :items="numericColumns"
              :label="selectedWidget.type === 'pie-chart' ? 'Value Column' : 'Y-Axis Column'"
              variant="outlined"
              density="compact"
              @update:model-value="
                updateSetting(selectedWidget.type === 'pie-chart' ? 'valueField' : 'yAxis', $event)
              "
            />
          </template>

          <!-- Column Mapping — KPI -->
          <template v-if="selectedWidget.type === 'kpi-card' && selectedColumns.length > 0">
            <v-select
              :model-value="selectedWidget.settings?.valueColumn || ''"
              :items="numericColumns"
              label="Value Column"
              variant="outlined"
              density="compact"
              @update:model-value="updateSetting('valueColumn', $event)"
            />
            <v-select
              :model-value="selectedWidget.settings?.targetColumn || ''"
              :items="numericColumns"
              label="Target Column"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="updateSetting('targetColumn', $event)"
            />
            <v-select
              :model-value="selectedWidget.settings?.trendColumn || ''"
              :items="numericColumns"
              label="Trend Column"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="updateSetting('trendColumn', $event)"
            />
          </template>

          <!-- Column Mapping — Data Table -->
          <template v-if="selectedWidget.type === 'data-table' && selectedColumns.length > 0">
            <v-select
              :model-value="selectedWidget.settings?.visibleColumns || selectedColumns"
              :items="selectedColumns"
              label="Visible Columns"
              variant="outlined"
              density="compact"
              multiple
              chips
              closable-chips
              @update:model-value="updateSetting('visibleColumns', $event)"
            />
          </template>
        </template>

        <v-divider v-if="isDataDriven" />

        <!-- Chart-specific settings -->
        <template v-if="isChartType">
          <h4 class="text-sm font-medium">Chart Settings</h4>
          <v-switch
            :model-value="selectedWidget.settings?.showLegend ?? true"
            label="Show Legend"
            density="compact"
            hide-details
            @update:model-value="updateSetting('showLegend', $event)"
          />
          <v-text-field
            v-if="selectedWidget.type !== 'pie-chart'"
            :model-value="selectedWidget.settings?.xAxisLabel || ''"
            label="X Axis Label"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('xAxisLabel', $event)"
          />
          <v-text-field
            v-if="selectedWidget.type !== 'pie-chart'"
            :model-value="selectedWidget.settings?.yAxisLabel || ''"
            label="Y Axis Label"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('yAxisLabel', $event)"
          />
        </template>

        <!-- KPI-specific settings (manual values when no data source) -->
        <template v-if="selectedWidget.type === 'kpi-card' && !selectedWidget.dataSourceId">
          <h4 class="text-sm font-medium">KPI Values</h4>
          <v-text-field
            :model-value="selectedWidget.settings?.value || 0"
            label="Value"
            type="number"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('value', Number($event))"
          />
          <v-text-field
            :model-value="selectedWidget.settings?.target || 0"
            label="Target"
            type="number"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('target', Number($event))"
          />
          <v-text-field
            :model-value="selectedWidget.settings?.trend || 0"
            label="Trend (%)"
            type="number"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('trend', Number($event))"
          />
        </template>

        <!-- KPI format (always visible for KPI) -->
        <template v-if="selectedWidget.type === 'kpi-card'">
          <v-select
            :model-value="selectedWidget.settings?.format || 'number'"
            :items="[
              { title: 'Number', value: 'number' },
              { title: 'Currency ($)', value: 'currency' },
              { title: 'Percent (%)', value: 'percent' },
            ]"
            label="Format"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('format', $event)"
          />
        </template>

        <!-- Text Block settings -->
        <template v-if="selectedWidget.type === 'text-block'">
          <h4 class="text-sm font-medium">Content</h4>
          <v-textarea
            :model-value="selectedWidget.settings?.content || ''"
            label="Text Content"
            variant="outlined"
            density="compact"
            rows="4"
            auto-grow
            @update:model-value="updateSetting('content', $event)"
          />
        </template>

        <!-- Image settings -->
        <template v-if="selectedWidget.type === 'image'">
          <h4 class="text-sm font-medium">Image Settings</h4>
          <v-text-field
            :model-value="selectedWidget.settings?.imageUrl || ''"
            label="Image URL"
            variant="outlined"
            density="compact"
            placeholder="https://example.com/image.png"
            @update:model-value="updateSetting('imageUrl', $event)"
          />
          <v-select
            :model-value="selectedWidget.settings?.objectFit || 'contain'"
            :items="[
              { title: 'Contain', value: 'contain' },
              { title: 'Cover', value: 'cover' },
              { title: 'Fill', value: 'fill' },
            ]"
            label="Fit Mode"
            variant="outlined"
            density="compact"
            @update:model-value="updateSetting('objectFit', $event)"
          />
        </template>
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

const isChartType = computed(() =>
  selectedWidget.value
    ? ['line-chart', 'bar-chart', 'pie-chart'].includes(selectedWidget.value.type)
    : false
)

const isDataDriven = computed(() =>
  selectedWidget.value
    ? ['line-chart', 'bar-chart', 'pie-chart', 'kpi-card', 'data-table'].includes(
        selectedWidget.value.type
      )
    : false
)

const dataSourceItems = computed(() => {
  return [
    { text: '(None — use demo data)', value: '' },
    ...store.dataSources.map((ds) => ({
      text: `${ds.name} (${ds.data.length} rows)`,
      value: ds.id,
    })),
  ]
})

const selectedColumns = computed(() => {
  if (!selectedWidget.value?.dataSourceId) return []
  const ds = store.getDataSourceById(selectedWidget.value.dataSourceId)
  return ds?.columns ?? []
})

const numericColumns = computed(() => {
  if (!selectedWidget.value?.dataSourceId) return []
  const ds = store.getDataSourceById(selectedWidget.value.dataSourceId)
  if (!ds || ds.data.length === 0) return []
  return ds.columns.filter((col) => {
    const sample = ds.data[0][col]
    return typeof sample === 'number' || !Number.isNaN(Number(sample))
  })
})

watch(
  selectedWidget,
  (widget) => {
    if (widget) {
      widgetTitle.value = widget.title
      widgetX.value = widget.x
      widgetY.value = widget.y
      widgetWidth.value = widget.width
      widgetHeight.value = widget.height
    }
  },
  { immediate: true }
)

function updateTitle(value: string) {
  if (selectedWidget.value) {
    store.updateWidgetWithHistory(selectedWidget.value.id, { title: value })
  }
}

function updateProperty(property: 'x' | 'y' | 'width' | 'height', value: number) {
  if (selectedWidget.value) {
    store.updateWidgetWithHistory(selectedWidget.value.id, { [property]: value })
  }
}

function updateDataSource(id: string | null) {
  if (selectedWidget.value) {
    store.updateWidgetWithHistory(selectedWidget.value.id, {
      dataSourceId: id || undefined,
    })
  }
}

function updateSetting(key: string, value: any) {
  if (selectedWidget.value) {
    const settings = { ...selectedWidget.value.settings, [key]: value }
    store.updateWidgetWithHistory(selectedWidget.value.id, { settings })
  }
}
</script>

<style scoped>
.property-editor {
  height: fit-content;
}
</style>
