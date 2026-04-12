<template>
  <div class="data-table-container h-full w-full overflow-auto">
    <v-data-table
      v-if="rows.length > 0"
      :headers="headers"
      :items="rows"
      density="compact"
      :items-per-page="10"
      class="text-sm"
    />
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      <div class="text-center">
        <v-icon size="large" class="mb-2">mdi-table-off</v-icon>
        <p class="text-sm">No data source assigned</p>
        <p class="text-xs mt-1">Select a data source in the properties panel</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '~/types/widgets'
import { useDashboardStore } from '~/stores/dashboard'

const props = defineProps<{ widget: Widget }>()
const store = useDashboardStore()

const dataSource = computed(() =>
  props.widget.dataSourceId ? store.getDataSourceById(props.widget.dataSourceId) : undefined
)

const visibleCols = computed(() => {
  const ds = dataSource.value
  if (!ds) return []
  const configured = props.widget.settings?.visibleColumns
  if (configured && configured.length > 0) return configured as string[]
  return ds.columns
})

const headers = computed(() =>
  visibleCols.value.map((col) => ({
    title: col.charAt(0).toUpperCase() + col.slice(1),
    key: col,
    sortable: true,
  }))
)

const rows = computed(() => {
  const ds = dataSource.value
  if (!ds) return []
  const cols = visibleCols.value
  return ds.data.map((row) => {
    const filtered: Record<string, any> = {}
    cols.forEach((c) => (filtered[c] = row[c]))
    return filtered
  })
})
</script>

<style scoped>
.data-table-container {
  min-height: 150px;
}
</style>
