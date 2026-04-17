import { describe, it, expect } from 'vitest'
import {
  getWidgetIcon,
  getWidgetLabel,
  DEFAULT_WIDGET_HEIGHTS,
  DEFAULT_WIDGET_WIDTHS,
} from '~/types/widgets'
import type { WidgetType } from '~/types/widgets'

const ALL_TYPES: WidgetType[] = [
  'line-chart',
  'bar-chart',
  'pie-chart',
  'kpi-card',
  'data-table',
  'text-block',
  'image',
]

describe('getWidgetIcon', () => {
  it('returns an mdi icon string for every known type', () => {
    ALL_TYPES.forEach((type) => {
      const icon = getWidgetIcon(type)
      expect(icon).toMatch(/^mdi-/)
    })
  })

  it('returns specific icons for chart types', () => {
    expect(getWidgetIcon('line-chart')).toBe('mdi-chart-line')
    expect(getWidgetIcon('bar-chart')).toBe('mdi-chart-bar')
    expect(getWidgetIcon('pie-chart')).toBe('mdi-chart-pie')
  })

  it('returns fallback for unknown type', () => {
    expect(getWidgetIcon('unknown' as WidgetType)).toBe('mdi-square')
  })
})

describe('getWidgetLabel', () => {
  it('capitalizes each word and removes hyphens', () => {
    expect(getWidgetLabel('line-chart')).toBe('Line Chart')
    expect(getWidgetLabel('kpi-card')).toBe('Kpi Card')
    expect(getWidgetLabel('data-table')).toBe('Data Table')
    expect(getWidgetLabel('text-block')).toBe('Text Block')
  })

  it('handles single-word type', () => {
    expect(getWidgetLabel('image')).toBe('Image')
  })
})

describe('DEFAULT_WIDGET_HEIGHTS', () => {
  it('has an entry for every widget type', () => {
    ALL_TYPES.forEach((type) => {
      expect(DEFAULT_WIDGET_HEIGHTS[type]).toBeTypeOf('number')
      expect(DEFAULT_WIDGET_HEIGHTS[type]).toBeGreaterThan(0)
    })
  })
})

describe('DEFAULT_WIDGET_WIDTHS', () => {
  it('has an entry for every widget type', () => {
    ALL_TYPES.forEach((type) => {
      expect(DEFAULT_WIDGET_WIDTHS[type]).toBeTypeOf('number')
      expect(DEFAULT_WIDGET_WIDTHS[type]).toBeGreaterThan(0)
      expect(DEFAULT_WIDGET_WIDTHS[type]).toBeLessThanOrEqual(12)
    })
  })
})
