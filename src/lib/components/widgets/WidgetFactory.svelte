<script lang="ts">
  import type { Widget } from '$lib/types/widgets';
  import ChartWidget from './ChartWidget.svelte';
  import KpiCard from './KpiCard.svelte';
  
  export let widget: Widget;
  export let isEditing = false;
  
  $: isChartType = ['line-chart', 'bar-chart', 'pie-chart'].includes(widget.type);
</script>

{#if isChartType}
  <ChartWidget {widget} {isEditing} 
    on:edit 
    on:delete 
    on:propertyChange 
    on:dataSourceChange 
    on:dataMappingChange
  />
{:else if widget.type === 'kpi-card'}
  <KpiCard {widget} {isEditing} 
    on:edit 
    on:delete 
    on:propertyChange 
    on:dataSourceChange 
    on:dataMappingChange
  />
{/if}