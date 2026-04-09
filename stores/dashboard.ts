import { defineStore } from 'pinia'
import type { DashboardConfig } from '~/types/layouts'
import type { Widget, DataSource } from '~/types/widgets'

const STORAGE_KEY = 'dashboard-builder-state'
const MAX_HISTORY = 50

interface DashboardState extends DashboardConfig {
  _history: string[]
  _historyIndex: number
  snackbar: { show: boolean; message: string; color: string }
}

function createDefaultState(): DashboardConfig {
  return {
    id: '',
    title: 'Untitled Dashboard',
    widgets: [],
    dataSources: [],
    selectedWidgetId: null,
    gridSize: 12,
    snapToGrid: true,
    theme: 'light',
  }
}

function serializableState(state: DashboardState): DashboardConfig {
  return {
    id: state.id,
    title: state.title,
    widgets: state.widgets,
    dataSources: state.dataSources,
    selectedWidgetId: state.selectedWidgetId,
    gridSize: state.gridSize,
    snapToGrid: state.snapToGrid,
    theme: state.theme,
  }
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    ...createDefaultState(),
    _history: [],
    _historyIndex: -1,
    snackbar: { show: false, message: '', color: 'success' },
  }),

  getters: {
    selectedWidget: (state): Widget | null => {
      if (!state.selectedWidgetId) return null
      return state.widgets.find((w) => w.id === state.selectedWidgetId) || null
    },

    minimizedWidgets: (state): Widget[] => {
      return state.widgets.filter((w) => w.isMinimized)
    },

    visibleWidgets: (state): Widget[] => {
      return state.widgets.filter((w) => !w.isMinimized)
    },

    canUndo: (state): boolean => state._historyIndex > 0,
    canRedo: (state): boolean => state._historyIndex < state._history.length - 1,

    getDataSourceById:
      (state) =>
      (id: string): DataSource | undefined => {
        return state.dataSources.find((ds) => ds.id === id)
      },
  },

  actions: {
    _saveSnapshot() {
      const snapshot = JSON.stringify(serializableState(this))
      if (this._historyIndex < this._history.length - 1) {
        this._history = this._history.slice(0, this._historyIndex + 1)
      }
      this._history.push(snapshot)
      if (this._history.length > MAX_HISTORY) {
        this._history.shift()
      }
      this._historyIndex = this._history.length - 1
    },

    _restoreSnapshot(snapshot: string) {
      const data = JSON.parse(snapshot) as DashboardConfig
      this.id = data.id
      this.title = data.title
      this.widgets = data.widgets
      this.dataSources = data.dataSources ?? []
      this.selectedWidgetId = data.selectedWidgetId
      this.gridSize = data.gridSize
      this.snapToGrid = data.snapToGrid
      this.theme = data.theme
    },

    undo() {
      if (!this.canUndo) return
      this._historyIndex--
      this._restoreSnapshot(this._history[this._historyIndex])
      this.saveToStorage()
    },

    redo() {
      if (!this.canRedo) return
      this._historyIndex++
      this._restoreSnapshot(this._history[this._historyIndex])
      this.saveToStorage()
    },

    showNotification(message: string, color = 'success') {
      this.snackbar = { show: true, message, color }
    },

    initialize() {
      if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const data = JSON.parse(stored)
            this.$patch(data)
            if (!this.dataSources) this.dataSources = []
          } catch (e) {
            console.error('Failed to load dashboard state:', e)
            this.resetToDefault()
          }
        } else {
          this.resetToDefault()
        }
        this._history = [JSON.stringify(serializableState(this))]
        this._historyIndex = 0
      }
    },

    resetToDefault() {
      const defaults = createDefaultState()
      defaults.id = crypto.randomUUID()
      this.$patch(defaults)
    },

    saveToStorage() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState(this)))
      }
    },

    selectWidget(id: string | null) {
      this.selectedWidgetId = id
      this.saveToStorage()
    },

    addWidget(widget: Widget) {
      this.widgets.push(widget)
      this.selectedWidgetId = widget.id
      this._saveSnapshot()
      this.saveToStorage()
    },

    updateWidget(id: string, changes: Partial<Widget>) {
      const index = this.widgets.findIndex((w) => w.id === id)
      if (index !== -1) {
        this.widgets[index] = { ...this.widgets[index], ...changes }
        this.saveToStorage()
      }
    },

    updateWidgetWithHistory(id: string, changes: Partial<Widget>) {
      this.updateWidget(id, changes)
      this._saveSnapshot()
    },

    removeWidget(id: string) {
      this.widgets = this.widgets.filter((w) => w.id !== id)
      if (this.selectedWidgetId === id) {
        this.selectedWidgetId = null
      }
      this._saveSnapshot()
      this.saveToStorage()
    },

    clearDashboard() {
      this.widgets = []
      this.selectedWidgetId = null
      this._saveSnapshot()
      this.saveToStorage()
    },

    updateTitle(title: string) {
      this.title = title
      this.saveToStorage()
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      this.saveToStorage()
    },

    addDataSource(source: DataSource) {
      this.dataSources.push(source)
      this._saveSnapshot()
      this.saveToStorage()
      this.showNotification(`Added "${source.name}" (${source.data.length} rows)`)
    },

    removeDataSource(id: string) {
      this.dataSources = this.dataSources.filter((ds) => ds.id !== id)
      this.widgets.forEach((w) => {
        if (w.dataSourceId === id) {
          w.dataSourceId = undefined
        }
      })
      this._saveSnapshot()
      this.saveToStorage()
      this.showNotification('Data source removed', 'info')
    },
  },
})
