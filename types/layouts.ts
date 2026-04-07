import type { Widget, DataSource } from './widgets'

export interface DashboardConfig {
  id: string
  title: string
  widgets: Widget[]
  dataSources: DataSource[]
  selectedWidgetId: string | null
  gridSize: number
  snapToGrid: boolean
  theme: 'light' | 'dark'
}
