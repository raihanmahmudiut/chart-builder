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
      <v-main>
        <v-container fluid class="pa-6">
          <div class="grid grid-cols-12 gap-6">
            <!-- Left Sidebar - Widget Palette & Data Sources -->
            <div class="col-span-2 flex flex-col space-y-4">
              <WidgetPalette />
              <DataSourcePanel />
            </div>

            <!-- Main Canvas Area -->
            <div class="col-span-8">
              <DashboardCanvas />
            </div>

            <!-- Right Sidebar - Property Editor -->
            <div class="col-span-2 flex flex-col space-y-2">
              <PropertyEditor />
              <MinimizedWidgetsContainer />
            </div>
          </div>
        </v-container>
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

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

