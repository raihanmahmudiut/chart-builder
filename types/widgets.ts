export type WidgetType =
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'kpi-card'
  | 'data-table'
  | 'text-block'
  | 'image'

export interface DataSource {
  id: string
  name: string
  type: 'csv' | 'api'
  data: Record<string, any>[]
  columns: string[]
}

export interface Widget {
  id: string
  type: WidgetType
  title: string
  x: number
  y: number
  width: number
  height: number
  dataSourceId?: string
  settings: Record<string, any>
  isMinimized?: boolean
}

export const DEFAULT_WIDGET_HEIGHTS: Record<WidgetType, number> = {
  'line-chart': 10,
  'bar-chart': 3,
  'pie-chart': 2,
  'kpi-card': 1,
  'data-table': 4,
  'text-block': 2,
  image: 2,
}

export const DEFAULT_WIDGET_WIDTHS: Record<WidgetType, number> = {
  'line-chart': 6,
  'bar-chart': 6,
  'pie-chart': 4,
  'kpi-card': 3,
  'data-table': 6,
  'text-block': 4,
  image: 3,
}

export function getWidgetIcon(type: WidgetType): string {
  switch (type) {
    case 'line-chart':
      return 'mdi-chart-line'
    case 'bar-chart':
      return 'mdi-chart-bar'
    case 'pie-chart':
      return 'mdi-chart-pie'
    case 'kpi-card':
      return 'mdi-trending-up'
    case 'data-table':
      return 'mdi-table'
    case 'text-block':
      return 'mdi-text'
    case 'image':
      return 'mdi-image'
    default:
      return 'mdi-square'
  }
}

export function getWidgetLabel(type: WidgetType): string {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
