import { defineStore } from 'pinia'
import type { DashboardConfig } from '~/types/layouts'
import type { Widget } from '~/types/widgets'

const STORAGE_KEY = 'dashboard-builder-state'

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardConfig => ({
    id: '',
    title: 'Untitled Dashboard',
    widgets: [],
    selectedWidgetId: null,
    gridSize: 12,
    snapToGrid: true,
    theme: 'light'
  }),

  getters: {
    selectedWidget: (state): Widget | null => {
      if (!state.selectedWidgetId) return null
      return state.widgets.find(w => w.id === state.selectedWidgetId) || null
    },

    minimizedWidgets: (state): Widget[] => {
      return state.widgets.filter(w => w.isMinimized)
    },

    visibleWidgets: (state): Widget[] => {
      return state.widgets.filter(w => !w.isMinimized)
    }
  },

  actions: {
    // Initialize store with saved state or default
    initialize() {
      if (process.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const data = JSON.parse(stored)
            this.$patch(data)
          } catch (e) {
            console.error('Failed to load dashboard state:', e)
            this.resetToDefault()
          }
        } else {
          this.resetToDefault()
        }
      }
    },

    // Reset to default state
    resetToDefault() {
      this.id = crypto.randomUUID()
      this.title = 'Untitled Dashboard'
      this.widgets = []
      this.selectedWidgetId = null
      this.gridSize = 12
      this.snapToGrid = true
      this.theme = 'light'
    },

    // Save to localStorage
    saveToStorage() {
      if (process.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
      }
    },

    // Select a widget
    selectWidget(id: string | null) {
      this.selectedWidgetId = id
      this.saveToStorage()
    },

    // Add a new widget
    addWidget(widget: Widget) {
      this.widgets.push(widget)
      this.selectedWidgetId = widget.id
      this.saveToStorage()
    },

    // Update a widget
    updateWidget(id: string, changes: Partial<Widget>) {
      const index = this.widgets.findIndex(w => w.id === id)
      if (index !== -1) {
        this.widgets[index] = { ...this.widgets[index], ...changes }
        this.saveToStorage()
      }
    },

    // Remove a widget
    removeWidget(id: string) {
      this.widgets = this.widgets.filter(w => w.id !== id)
      if (this.selectedWidgetId === id) {
        this.selectedWidgetId = null
      }
      this.saveToStorage()
    },

    // Clear all widgets
    clearDashboard() {
      this.widgets = []
      this.selectedWidgetId = null
      this.saveToStorage()
    },

    // Update dashboard title
    updateTitle(title: string) {
      this.title = title
      this.saveToStorage()
    }
  }
})

