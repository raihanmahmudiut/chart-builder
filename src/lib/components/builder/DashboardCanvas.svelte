<script lang="ts">
  import { dashboardStore } from '$lib/stores/dashboardStore';
  import { droppable, type DropItemEventDetail } from '$lib/actions/dnd';
  import { DEFAULT_WIDGET_HEIGHTS, DEFAULT_WIDGET_WIDTHS } from '$lib/types/widgets';
  import type { Widget, WidgetType } from '$lib/types/widgets';
  import { getWidgetLabel } from '$lib/types/widgets';
	import WidgetWrapper from './WidgetWrapper.svelte';

  // Grid settings
  let showGrid = true;
  let gridGap = 4; // Gap between grid cells in pixels

  // Calculate grid cell size based on container width
  let containerWidth = 0;
  let containerHeight = 0;
  let gridCellWidth = 0;

  $: gridCellWidth = containerWidth ? (containerWidth - ($dashboardStore.gridSize - 1) * gridGap) / $dashboardStore.gridSize : 0;

  // Handle widget drops
  function handleWidgetDrop(event: CustomEvent<DropItemEventDetail>) {
    const { getData, x, y } = event.detail;
    const widgetType = getData('widget-type') as WidgetType;
    
    if (!widgetType) return;
    
    // Calculate grid position from pixel coordinates
    const gridX = Math.floor(x / (gridCellWidth + gridGap));
    const gridY = Math.floor(y / (containerHeight / 10)); // Rough estimate for row height
    
    // Create new widget
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type: widgetType,
      title: `New ${getWidgetLabel(widgetType)}`,
      x: gridX,
      y: gridY,
      width: DEFAULT_WIDGET_WIDTHS[widgetType] || 3,
      height: DEFAULT_WIDGET_HEIGHTS[widgetType] || 2,
      dataMapping: {},
      settings: {}
    };
    
    // Add to dashboard
    dashboardStore.addWidget(newWidget);
  }

  // Handle widget selection
  function selectWidget(id: string) {
    dashboardStore.selectWidget(id);
  }

  // Measure container
  function measureContainer(node: HTMLElement) {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        containerWidth = entry.contentRect.width;
        containerHeight = entry.contentRect.height;
      }
    });
    
    resizeObserver.observe(node);
    
    return {
      destroy() {
        resizeObserver.disconnect();
      }
    };
  }
</script>
<div 
  class="relative bg-gray-50 border border-gray-200 rounded-lg min-h-[600px] w-full overflow-hidden"
  use:droppable
  use:measureContainer
  on:drop-item={(event: CustomEvent) => handleWidgetDrop(event)}
  role="application"
>
  <!-- Grid background -->
  {#if showGrid && containerWidth > 0}
    <div class="absolute inset-0 pointer-events-none">
      {#each Array($dashboardStore.gridSize + 1) as _, i}
        <div 
          class="absolute top-0 bottom-0 border-r border-dashed border-gray-200"
          style="left: {i * (gridCellWidth + gridGap)}px; width: 1px;"
        ></div>
      {/each}
      
      {#each Array(20) as _, i}
        <div 
          class="absolute left-0 right-0 border-b border-dashed border-gray-200"
          style="top: {i * 40}px; height: 1px;"
        ></div>
      {/each}
    </div>
  {/if}
  
  <!-- Widgets -->
  {#each $dashboardStore.widgets.filter(w => !w.isMinimized) as widget (widget.id)}
    <WidgetWrapper 
      {widget}
      isSelected={$dashboardStore.selectedWidgetId === widget.id}
      cellWidth={gridCellWidth}
      cellHeight={40}
      gap={gridGap}
      on:select={() => selectWidget(widget.id)}
    />
  {/each}
  
  <!-- Empty state -->
  {#if $dashboardStore.widgets.length === 0}
    <div class="absolute inset-0 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <p class="text-xl">Drag widgets here to build your dashboard</p>
        <p class="text-sm mt-2">Start by dragging a widget from the palette on the left</p>
      </div>
    </div>
  {/if}
</div>