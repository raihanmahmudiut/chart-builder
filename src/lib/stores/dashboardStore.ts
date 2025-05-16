// src/lib/stores/dashboardStore.ts
import { writable } from 'svelte/store';
import type { DashboardConfig } from '$lib/types/layouts';
import { browser } from '$app/environment';
import type { Widget } from '$lib/types/widgets';

const STORAGE_KEY = 'dashboard-builder-state';

// Initialize with saved state or default state
function createDashboardStore() {
  // Default initial state
  const initialDashboard: DashboardConfig = {
    id: crypto.randomUUID(),
    title: 'Untitled Dashboard',
    widgets: [],
    selectedWidgetId: null,
    gridSize: 12,
    snapToGrid: true,
    theme: 'light'
  };

  // Load from localStorage if available
  const storedValue = browser ? localStorage.getItem(STORAGE_KEY) : null;
  const initialValue = storedValue ? JSON.parse(storedValue) : initialDashboard;
  
  const store = writable<DashboardConfig>(initialValue);
  
  // Subscribe to changes and save to localStorage
  if (browser) {
    store.subscribe(value => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  return {
    ...store,
    // Helper methods
    selectWidget: (id: string | null) => {
      store.update(dashboard => ({ ...dashboard, selectedWidgetId: id }));
    },
    addWidget: (widget: Widget) => {
      store.update(dashboard => ({
        ...dashboard,
        widgets: [...dashboard.widgets, widget],
        selectedWidgetId: widget.id
      }));
    },
    updateWidget: (id: string, changes: Partial<Widget>) => {
      store.update(dashboard => ({
        ...dashboard,
        widgets: dashboard.widgets.map(widget => 
          widget.id === id ? { ...widget, ...changes } : widget
        )
      }));
    },
    removeWidget: (id: string) => {
      store.update(dashboard => ({
        ...dashboard,
        widgets: dashboard.widgets.filter(widget => widget.id !== id),
        selectedWidgetId: dashboard.selectedWidgetId === id ? null : dashboard.selectedWidgetId
      }));
    },
    clearDashboard: () => {
      store.update(dashboard => ({
        ...dashboard,
        widgets: [],
        selectedWidgetId: null
      }));
    }
  };
}

export const dashboardStore = createDashboardStore();