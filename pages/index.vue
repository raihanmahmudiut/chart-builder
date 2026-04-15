<template>
  <v-app :theme="store.theme">
    <div class="min-h-screen">
      <!-- Header -->
      <v-app-bar color="surface" elevation="1">
        <v-app-bar-title class="flex items-center gap-4">
          <span class="text-xl font-semibold">Dashboard Builder</span>
          <v-text-field
            v-model="dashboardTitle"
            variant="outlined"
            density="compact"
            placeholder="Dashboard title"
            hide-details
            class="max-w-xs"
            @update:model-value="updateDashboardTitle"
          />
        </v-app-bar-title>

        <template #append>
          <!-- Undo / Redo -->
          <v-btn
            icon
            variant="text"
            :disabled="!store.canUndo"
            title="Undo (Ctrl+Z)"
            @click="store.undo()"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            :disabled="!store.canRedo"
            title="Redo (Ctrl+Shift+Z)"
            @click="store.redo()"
          >
            <v-icon>mdi-redo</v-icon>
          </v-btn>

          <v-divider vertical class="mx-1" />

          <!-- Dark mode toggle -->
          <v-btn
            icon
            variant="text"
            :title="store.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'"
            @click="toggleTheme"
          >
            <v-icon>{{
              store.theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'
            }}</v-icon>
          </v-btn>

          <v-divider vertical class="mx-1" />

          <!-- Export / Import -->
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-btn variant="text" prepend-icon="mdi-export" v-bind="menuProps">Export</v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click="exportJSON">
                <v-list-item-title>Export as JSON</v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportPNG">
                <v-list-item-title>Export as PNG</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn variant="text" prepend-icon="mdi-import" @click="triggerImport">Import</v-btn>
          <input
            ref="importInput"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleImport"
          />

          <v-divider vertical class="mx-1" />

          <v-btn variant="outlined" class="mr-2" @click="clearDashboard">Clear</v-btn>
          <v-btn color="primary" @click="saveDashboard">Save</v-btn>
        </template>
      </v-app-bar>

      <!-- Main Content -->
      <v-main class="main-content">
        <div class="dashboard-layout">
          <!-- Left Sidebar -->
          <div class="sidebar-left">
            <WidgetPalette />
            <DataSourcePanel />
          </div>

          <!-- Main Canvas Area -->
          <div ref="canvasAreaRef" class="canvas-area">
            <DashboardCanvas />
          </div>

          <!-- Right Sidebar -->
          <div class="sidebar-right">
            <PropertyEditor />
            <MinimizedWidgetsContainer />
          </div>
        </div>
      </v-main>

      <!-- Snackbar -->
      <v-snackbar
        v-model="store.snackbar.show"
        :color="store.snackbar.color"
        :timeout="3000"
        location="bottom right"
      >
        {{ store.snackbar.message }}
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDashboardStore } from '~/stores/dashboard'
import WidgetPalette from '~/components/builder/WidgetPalette.vue'
import DashboardCanvas from '~/components/builder/DashboardCanvas.vue'
import PropertyEditor from '~/components/builder/PropertyEditor.vue'
import MinimizedWidgetsContainer from '~/components/builder/MinimizedWidgetsContainer.vue'
import DataSourcePanel from '~/components/builder/DataSourcePanel.vue'

const store = useDashboardStore()
const dashboardTitle = ref('')
const canvasAreaRef = ref<HTMLElement | null>(null)
const importInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  store.initialize()
  dashboardTitle.value = store.title
  document.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard)
})

watch(
  () => store.title,
  (v) => (dashboardTitle.value = v)
)

function handleKeyboard(e: KeyboardEvent) {
  const ctrl = e.ctrlKey || e.metaKey
  if (ctrl && e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    store.undo()
  } else if (ctrl && e.key === 'z' && e.shiftKey) {
    e.preventDefault()
    store.redo()
  } else if (ctrl && e.key === 'y') {
    e.preventDefault()
    store.redo()
  }
}

function updateDashboardTitle(value: string) {
  store.updateTitle(value)
}

function toggleTheme() {
  store.setTheme(store.theme === 'dark' ? 'light' : 'dark')
}

function clearDashboard() {
  if (confirm('Are you sure you want to clear the dashboard? This action cannot be undone.')) {
    store.clearDashboard()
  }
}

function saveDashboard() {
  store.saveToStorage()
  store.showNotification('Dashboard saved')
}

function exportJSON() {
  const data = {
    id: store.id,
    title: store.title,
    widgets: store.widgets,
    dataSources: store.dataSources,
    gridSize: store.gridSize,
    theme: store.theme,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${store.title || 'dashboard'}.json`)
  store.showNotification('Dashboard exported as JSON')
}

async function exportPNG() {
  const el = canvasAreaRef.value
  if (!el) return
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        downloadBlob(blob, `${store.title || 'dashboard'}.png`)
        store.showNotification('Dashboard exported as PNG')
      }
    })
  } catch {
    store.showNotification('Failed to export PNG', 'error')
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function triggerImport() {
  importInput.value?.click()
}

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target?.result as string)
      store.$patch({
        id: data.id || crypto.randomUUID(),
        title: data.title || 'Imported Dashboard',
        widgets: data.widgets || [],
        dataSources: data.dataSources || [],
        gridSize: data.gridSize || 12,
        theme: data.theme || 'light',
        selectedWidgetId: null,
      })
      store.saveToStorage()
      dashboardTitle.value = store.title
      store.showNotification('Dashboard imported successfully')
    } catch {
      store.showNotification('Invalid JSON file', 'error')
    }
  }
  reader.readAsText(file)
  if (importInput.value) importInput.value.value = ''
}
</script>

<style scoped>
.main-content {
  height: calc(100vh - 64px);
  overflow: hidden;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 256px 1fr 256px;
  gap: 24px;
  height: 100%;
  padding: 24px;
  overflow: hidden;
}

.sidebar-left,
.sidebar-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100%;
}

.canvas-area {
  height: 100%;
  overflow: hidden;
}

.sidebar-left::-webkit-scrollbar,
.sidebar-right::-webkit-scrollbar {
  width: 6px;
}

.sidebar-left::-webkit-scrollbar-track,
.sidebar-right::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.sidebar-left::-webkit-scrollbar-thumb,
.sidebar-right::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}
</style>
