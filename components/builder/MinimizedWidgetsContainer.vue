<template>
  <v-card v-if="minimizedWidgets.length > 0" class="minimized-container" elevation="2">
    <v-card-title class="text-sm font-medium py-2">Minimized Widgets</v-card-title>
    <v-card-text class="pa-2">
      <div class="flex flex-wrap gap-2">
        <v-chip
          v-for="widget in minimizedWidgets"
          :key="widget.id"
          closable
          @click="restoreWidget(widget.id)"
          @click:close="deleteWidget(widget.id)"
        >
          <v-icon :icon="getWidgetIcon(widget.type)" size="small" class="mr-1" />
          {{ widget.title }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '~/stores/dashboard'
import { getWidgetIcon } from '~/types/widgets'

const store = useDashboardStore()

const minimizedWidgets = computed(() => store.minimizedWidgets)

const restoreWidget = (id: string) => {
  store.updateWidget(id, { isMinimized: false })
  store.selectWidget(id)
}

const deleteWidget = (id: string) => {
  store.removeWidget(id)
}
</script>

<style scoped>
.minimized-container {
  margin-top: 8px;
}
</style>

