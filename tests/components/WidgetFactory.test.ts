import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WidgetFactory from '~/components/widgets/WidgetFactory.vue'
import type { Widget, WidgetType } from '~/types/widgets'

// Chart.js uses canvas — stub with a constructor function for happy-dom
vi.mock('chart.js/auto', () => {
  function MockChart() {
    return { update: vi.fn(), destroy: vi.fn(), data: {}, options: {} }
  }
  return { default: MockChart }
})

function makeWidget(type: WidgetType, overrides: Partial<Widget> = {}): Widget {
  return {
    id: 'test-' + type,
    type,
    title: 'Test ' + type,
    x: 0,
    y: 0,
    width: 4,
    height: 3,
    settings: {},
    ...overrides,
  }
}

describe('WidgetFactory', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders ChartWidget for line-chart', () => {
    const wrapper = mount(WidgetFactory, {
      props: { widget: makeWidget('line-chart') },
    })
    expect(wrapper.findComponent({ name: 'ChartWidget' }).exists()).toBe(true)
  })

  it('renders ChartWidget for bar-chart', () => {
    const wrapper = mount(WidgetFactory, {
      props: { widget: makeWidget('bar-chart') },
    })
    expect(wrapper.findComponent({ name: 'ChartWidget' }).exists()).toBe(true)
  })

  it('renders ChartWidget for pie-chart', () => {
    const wrapper = mount(WidgetFactory, {
      props: { widget: makeWidget('pie-chart') },
    })
    expect(wrapper.findComponent({ name: 'ChartWidget' }).exists()).toBe(true)
  })

  it('renders KpiCard for kpi-card', () => {
    const wrapper = mount(WidgetFactory, {
      props: {
        widget: makeWidget('kpi-card', {
          settings: { value: 100, target: 200, trend: 5, format: 'number' },
        }),
      },
    })
    expect(wrapper.findComponent({ name: 'KpiCard' }).exists()).toBe(true)
  })

  it('renders DataTableWidget for data-table', () => {
    const wrapper = mount(WidgetFactory, {
      props: { widget: makeWidget('data-table') },
    })
    expect(wrapper.findComponent({ name: 'DataTableWidget' }).exists()).toBe(true)
  })

  it('renders TextBlockWidget for text-block', () => {
    const wrapper = mount(WidgetFactory, {
      props: {
        widget: makeWidget('text-block', { settings: { content: 'Hello' } }),
      },
    })
    expect(wrapper.findComponent({ name: 'TextBlockWidget' }).exists()).toBe(true)
  })

  it('renders ImageWidget for image', () => {
    const wrapper = mount(WidgetFactory, {
      props: {
        widget: makeWidget('image', { settings: { imageUrl: '' } }),
      },
    })
    expect(wrapper.findComponent({ name: 'ImageWidget' }).exists()).toBe(true)
  })
})
