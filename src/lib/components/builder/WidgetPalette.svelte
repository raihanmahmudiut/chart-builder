<script lang="ts">
  import { draggable } from '$lib/actions/dnd';
  import type { WidgetType } from '$lib/types/widgets';
  import { getWidgetIcon, getWidgetLabel } from '$lib/types/widgets';
  
  // Widget types available in the palette
  const widgetTypes: WidgetType[] = [
    'line-chart',
    'bar-chart',
    'pie-chart',
    'kpi-card',
    'data-table',
    'text-block',
    'image'
  ];
</script>

<div class="bg-white shadow-md rounded-lg p-4">
  <h2 class="font-medium text-lg mb-4">Widgets</h2>
  
  <div class="space-y-2">
    {#each widgetTypes as type}
      <div 
        class="p-3 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-move flex items-center gap-3"
        use:draggable={{
          'widget-type': type,
          fromPalette: true
        }}
      >
        <span class="text-gray-600">
          <!-- Replace with actual icon components when you have them -->
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <use href="#{getWidgetIcon(type)}"></use>
          </svg>
        </span>
        <span>{getWidgetLabel(type)}</span>
      </div>
    {/each}
  </div>
</div>