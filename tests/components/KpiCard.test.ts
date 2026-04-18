import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import KpiCard from '~/components/widgets/KpiCard.vue'
import type { Widget } from '~/types/widgets'

function makeKpiWidget(settings: Record<string, any> = {}): Widget {
  return {
    id: 'kpi-1',
    type: 'kpi-card',
    title: 'Revenue',
    x: 0,
    y: 0,
    width: 3,
    height: 2,
    settings: {
      value: 125000,
      target: 150000,
      trend: 8.5,
      format: 'currency',
      ...settings,
    },
  }
}

describe('KpiCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the formatted value', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget() },
    })
    const text = wrapper.text()
    expect(text).toContain('$125,000.00')
  })

  it('renders target when set', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ target: 150000 }) },
    })
    expect(wrapper.text()).toContain('Target')
    expect(wrapper.text()).toContain('$150,000.00')
  })

  it('hides target when zero', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ target: 0 }) },
    })
    expect(wrapper.text()).not.toContain('Target')
  })

  it('shows upward trend arrow for positive trend', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ trend: 8.5 }) },
    })
    expect(wrapper.text()).toContain('\u2191')
    expect(wrapper.text()).toContain('8.5%')
  })

  it('shows downward trend arrow for negative trend', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ trend: -3.2 }) },
    })
    expect(wrapper.text()).toContain('\u2193')
    expect(wrapper.text()).toContain('3.2%')
  })

  it('formats as number when format is number', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ value: 5420, format: 'number' }) },
    })
    expect(wrapper.text()).toContain('5,420')
  })

  it('formats as percent when format is percent', () => {
    const wrapper = mount(KpiCard, {
      props: { widget: makeKpiWidget({ value: 75, format: 'percent' }) },
    })
    expect(wrapper.text()).toContain('75.0%')
  })
})
