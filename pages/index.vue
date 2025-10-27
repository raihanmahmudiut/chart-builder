<template>
  <v-app>
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <v-app-bar color="white" elevation="1">
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
          <v-btn
            variant="outlined"
            class="mr-2"
            @click="clearDashboard"
          >
            Clear
          </v-btn>
          <v-btn
            color="primary"
            @click="saveDashboard"
          >
            Save
          </v-btn>
        </template>
      </v-app-bar>

      <!-- Main Content -->
      <v-main class="main-content">
        <div class="dashboard-layout">
          <!-- Left Sidebar - Widget Palette & Data Sources -->
          <div class="sidebar-left">
            <WidgetPalette />
            <DataSourcePanel />
          </div>

          <!-- Main Canvas Area -->
          <div class="canvas-area">
            <DashboardCanvas />
          </div>

          <!-- Right Sidebar - Property Editor -->
          <div class="sidebar-right">
            <PropertyEditor />
            <MinimizedWidgetsContainer />
          </div>
        </div>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useDashboardStore } from '~/stores/dashboard'
import WidgetPalette from '~/components/builder/WidgetPalette.vue'
import DashboardCanvas from '~/components/builder/DashboardCanvas.vue'
import PropertyEditor from '~/components/builder/PropertyEditor.vue'
import MinimizedWidgetsContainer from '~/components/builder/MinimizedWidgetsContainer.vue'
import DataSourcePanel from '~/components/builder/DataSourcePanel.vue'

const store = useDashboardStore()
const dashboardTitle = ref('')

// Initialize store on mount
onMounted(() => {
  store.initialize()
  dashboardTitle.value = store.title
})

// Watch for store title changes
watch(() => store.title, (newTitle) => {
  dashboardTitle.value = newTitle
})

const updateDashboardTitle = (value: string) => {
  store.updateTitle(value)
}

const clearDashboard = () => {
  if (confirm('Are you sure you want to clear the dashboard? This action cannot be undone.')) {
    store.clearDashboard()
  }
}

const saveDashboard = () => {
  store.saveToStorage()
  alert('Dashboard saved to local storage')
}
</script>

<style scoped>
.main-content {
  height: calc(100vh - 64px); /* Full viewport height minus header */
  overflow: hidden;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 256px 1fr 256px; /* Fixed sidebars, flexible canvas */
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

/* Scrollbar styling for sidebars */
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

.sidebar-left::-webkit-scrollbar-thumb:hover,
.sidebar-right::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

