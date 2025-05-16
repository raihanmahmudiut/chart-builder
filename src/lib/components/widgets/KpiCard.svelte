<script lang="ts">
  import type { Widget } from '$lib/types/widgets';
  import BaseWidget from './BaseWidget.svelte';
  
  export let widget: Widget;
  export let isEditing = false;
  
  $: value = widget.settings?.value || 0;
  $: target = widget.settings?.target || 0;
  $: format = widget.settings?.format || 'number';
  $: trend = widget.settings?.trend || 0;
  
  function formatValue(val: number): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val);
      case 'percent':
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 1
        }).format(val / 100);
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  }
</script>

<BaseWidget {widget} {isEditing} on:edit on:delete on:propertyChange>
  <div class="kpi-container">
    <div class="kpi-value">{formatValue(value)}</div>
    
    {#if target > 0}
      <div class="kpi-target">
        Target: {formatValue(target)}
      </div>
    {/if}
    
    {#if trend !== 0}
      <div class="kpi-trend" class:positive={trend > 0} class:negative={trend < 0}>
        <span class="trend-arrow">
          {trend > 0 ? '↑' : '↓'}
        </span>
        <span class="trend-value">{Math.abs(trend)}%</span>
      </div>
    {/if}
  </div>
</BaseWidget>

<style>
  .kpi-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }
  
  .kpi-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .kpi-target {
    font-size: 0.875rem;
    color: #718096;
    margin-bottom: 0.5rem;
  }
  
  .kpi-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .kpi-trend.positive {
    background-color: rgba(72, 187, 120, 0.1);
    color: #2f855a;
  }
  
  .kpi-trend.negative {
    background-color: rgba(245, 101, 101, 0.1);
    color: #c53030;
  }
  
  .trend-arrow {
    font-size: 1rem;
  }
  
  .trend-value {
    font-weight: 500;
  }
</style>