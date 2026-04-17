import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardStore } from '~/stores/dashboard'
import type { Widget, DataSource } from '~/types/widgets'

function makeWidget(overrides: Partial<Widget> = {}): Widget {
  return {
    id: crypto.randomUUID(),
    type: 'bar-chart',
    title: 'Test Widget',
    x: 0,
    y: 0,
    width: 4,
    height: 3,
    settings: {},
    ...overrides,
  }
}

function makeDataSource(overrides: Partial<DataSource> = {}): DataSource {
  return {
    id: crypto.randomUUID(),
    name: 'test.csv',
    type: 'csv',
    data: [
      { date: '2024-01', value: 100 },
      { date: '2024-02', value: 200 },
    ],
    columns: ['date', 'value'],
    ...overrides,
  }
}

describe('dashboard store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('default state', () => {
    it('starts with empty widgets and data sources', () => {
      const store = useDashboardStore()
      expect(store.widgets).toEqual([])
      expect(store.dataSources).toEqual([])
      expect(store.selectedWidgetId).toBeNull()
      expect(store.theme).toBe('light')
      expect(store.gridSize).toBe(12)
    })
  })

  describe('widget management', () => {
    it('addWidget pushes widget and selects it', () => {
      const store = useDashboardStore()
      const w = makeWidget({ id: 'w1' })
      store.addWidget(w)

      expect(store.widgets).toHaveLength(1)
      expect(store.widgets[0].id).toBe('w1')
      expect(store.selectedWidgetId).toBe('w1')
    })

    it('removeWidget removes by id and clears selection', () => {
      const store = useDashboardStore()
      const w = makeWidget({ id: 'w1' })
      store.addWidget(w)
      store.removeWidget('w1')

      expect(store.widgets).toHaveLength(0)
      expect(store.selectedWidgetId).toBeNull()
    })

    it('updateWidget merges changes', () => {
      const store = useDashboardStore()
      store.addWidget(makeWidget({ id: 'w1', title: 'Before' }))
      store.updateWidget('w1', { title: 'After' })

      expect(store.widgets[0].title).toBe('After')
      expect(store.widgets[0].type).toBe('bar-chart')
    })

    it('clearDashboard empties widgets', () => {
      const store = useDashboardStore()
      store.addWidget(makeWidget())
      store.addWidget(makeWidget())
      store.clearDashboard()

      expect(store.widgets).toHaveLength(0)
      expect(store.selectedWidgetId).toBeNull()
    })

    it('selectWidget sets selectedWidgetId', () => {
      const store = useDashboardStore()
      store.addWidget(makeWidget({ id: 'w1' }))
      store.selectWidget('w1')
      expect(store.selectedWidgetId).toBe('w1')

      store.selectWidget(null)
      expect(store.selectedWidgetId).toBeNull()
    })
  })

  describe('getters', () => {
    it('selectedWidget returns the matching widget', () => {
      const store = useDashboardStore()
      const w = makeWidget({ id: 'w1' })
      store.addWidget(w)
      store.selectWidget('w1')

      expect(store.selectedWidget?.id).toBe('w1')
    })

    it('selectedWidget returns null when nothing selected', () => {
      const store = useDashboardStore()
      expect(store.selectedWidget).toBeNull()
    })

    it('minimizedWidgets filters correctly', () => {
      const store = useDashboardStore()
      store.addWidget(makeWidget({ id: 'w1', isMinimized: false }))
      store.addWidget(makeWidget({ id: 'w2', isMinimized: true }))

      expect(store.minimizedWidgets).toHaveLength(1)
      expect(store.minimizedWidgets[0].id).toBe('w2')
    })

    it('visibleWidgets excludes minimized', () => {
      const store = useDashboardStore()
      store.addWidget(makeWidget({ id: 'w1', isMinimized: false }))
      store.addWidget(makeWidget({ id: 'w2', isMinimized: true }))

      expect(store.visibleWidgets).toHaveLength(1)
      expect(store.visibleWidgets[0].id).toBe('w1')
    })
  })

  describe('data source management', () => {
    it('addDataSource pushes to dataSources', () => {
      const store = useDashboardStore()
      const ds = makeDataSource({ id: 'ds1' })
      store.addDataSource(ds)

      expect(store.dataSources).toHaveLength(1)
      expect(store.dataSources[0].id).toBe('ds1')
    })

    it('removeDataSource removes and clears widget references', () => {
      const store = useDashboardStore()
      const ds = makeDataSource({ id: 'ds1' })
      store.addDataSource(ds)
      store.addWidget(makeWidget({ id: 'w1', dataSourceId: 'ds1' }))
      store.removeDataSource('ds1')

      expect(store.dataSources).toHaveLength(0)
      expect(store.widgets[0].dataSourceId).toBeUndefined()
    })

    it('getDataSourceById returns the right source', () => {
      const store = useDashboardStore()
      const ds = makeDataSource({ id: 'ds1', name: 'Sales' })
      store.addDataSource(ds)

      expect(store.getDataSourceById('ds1')?.name).toBe('Sales')
      expect(store.getDataSourceById('nonexistent')).toBeUndefined()
    })
  })

  describe('undo / redo', () => {
    function initHistory(store: ReturnType<typeof useDashboardStore>) {
      store._history = [JSON.stringify({ ...store.$state })]
      store._historyIndex = 0
    }

    it('starts with canUndo=false, canRedo=false', () => {
      const store = useDashboardStore()
      expect(store.canUndo).toBe(false)
      expect(store.canRedo).toBe(false)
    })

    it('undo reverts addWidget', () => {
      const store = useDashboardStore()
      initHistory(store)

      store.addWidget(makeWidget({ id: 'w1' }))
      expect(store.widgets).toHaveLength(1)
      expect(store.canUndo).toBe(true)

      store.undo()
      expect(store.widgets).toHaveLength(0)
      expect(store.canUndo).toBe(false)
    })

    it('redo restores undone action', () => {
      const store = useDashboardStore()
      initHistory(store)

      store.addWidget(makeWidget({ id: 'w1' }))
      expect(store.widgets).toHaveLength(1)

      store.undo()
      expect(store.widgets).toHaveLength(0)
      expect(store.canRedo).toBe(true)

      store.redo()
      expect(store.widgets).toHaveLength(1)
      expect(store.widgets[0].id).toBe('w1')
      expect(store.canRedo).toBe(false)
    })

    it('new action after undo discards redo stack', () => {
      const store = useDashboardStore()
      initHistory(store)

      store.addWidget(makeWidget({ id: 'w1' }))
      store.addWidget(makeWidget({ id: 'w2' }))
      store.undo()
      store.addWidget(makeWidget({ id: 'w3' }))

      expect(store.canRedo).toBe(false)
    })

    it('undo/redo works across multiple actions', () => {
      const store = useDashboardStore()
      initHistory(store)

      store.addWidget(makeWidget({ id: 'w1' }))
      store.addWidget(makeWidget({ id: 'w2' }))
      expect(store.widgets).toHaveLength(2)

      store.undo()
      expect(store.widgets).toHaveLength(1)
      expect(store.widgets[0].id).toBe('w1')

      store.undo()
      expect(store.widgets).toHaveLength(0)

      store.redo()
      expect(store.widgets).toHaveLength(1)

      store.redo()
      expect(store.widgets).toHaveLength(2)
    })
  })

  describe('theme', () => {
    it('setTheme changes theme', () => {
      const store = useDashboardStore()
      store.setTheme('dark')
      expect(store.theme).toBe('dark')

      store.setTheme('light')
      expect(store.theme).toBe('light')
    })
  })

  describe('notifications', () => {
    it('showNotification sets snackbar state', () => {
      const store = useDashboardStore()
      store.showNotification('Hello', 'error')

      expect(store.snackbar.show).toBe(true)
      expect(store.snackbar.message).toBe('Hello')
      expect(store.snackbar.color).toBe('error')
    })

    it('defaults to success color', () => {
      const store = useDashboardStore()
      store.showNotification('Done')
      expect(store.snackbar.color).toBe('success')
    })
  })

  describe('title', () => {
    it('updateTitle changes the title', () => {
      const store = useDashboardStore()
      store.updateTitle('My Dashboard')
      expect(store.title).toBe('My Dashboard')
    })
  })
})
