<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { draggable } from '$lib/actions/dnd';
    import { dashboardStore } from '$lib/stores/dashboardStore';
    import type { Widget } from '$lib/types/widgets';
    import { getWidgetIcon } from '$lib/types/widgets';
	import WidgetFactory from '../widgets/WidgetFactory.svelte';
	import { resizable } from '$lib/actions/resize';
    
    export let widget: Widget;
    export let isSelected = false;
    export let cellWidth = 100;
    export let cellHeight = 40;
    export let gap = 4;
    export let isMinimized = false;
    
    const dispatch = createEventDispatcher();
  
    // Calculate position and size
    $: style = `
      position: absolute;
      left: ${widget.x * (cellWidth + gap)}px;
      top: ${widget.y * (cellHeight + gap)}px;
      width: ${widget.width * cellWidth + (widget.width - 1) * gap}px;
      height: ${widget.height * cellHeight + (widget.height - 1) * gap}px;
      z-index: ${isSelected ? 100 : 1};
    `;
    
    // Select this widget when clicked
    function handleClick() {
      dispatch('select');
      
    }
    
    // Delete this widget
    function deleteWidget(event: MouseEvent) {
      event.stopPropagation();
      dashboardStore.removeWidget(widget.id);
    }
  
    function toggleMinimize() {
      isMinimized = !isMinimized;
      dashboardStore.updateWidget(widget.id, { isMinimized });
      dispatch('minimize', { id: widget.id, isMinimized });
    }
  
    </script>
  
    <button 
      class="absolute bg-white rounded-md shadow-sm border overflow-hidden transition-all duration-200 
             {isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-blue-300'}"
      style={style}
      on:click={handleClick}
      tabindex="0"
      use:draggable={{
        'widget-id': widget.id,
        fromPalette: false,
        onDragEnd: (pos) => {
          dashboardStore.updateWidget(widget.id, {
            x: Math.floor(pos.x / (cellWidth + gap)),
            y: Math.floor(pos.y / (cellHeight + gap))
          });
        }
      }}
      use:resizable={{
        onResize: ({ width, height }) => {
          dashboardStore.updateWidget(widget.id, {
            width: Math.floor(width / (cellWidth + gap)),
            height: Math.floor(height / (cellHeight + gap))
          });
        },
        minWidth: cellWidth,
        minHeight: cellHeight
      }}
    >
      <!-- Widget header -->
      <div class="p-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">
            <!-- Replace with actual icon components when you have them -->
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <use href="#getWidgetIcon(widget.type)"></use>
            </svg>
          </span>
          <span class="text-sm font-medium truncate">{widget.title}</span>
        </div>
        <div class="flex gap-1">
          <!-- Minimize Button -->
          <div
            class="p-1 text-gray-400 hover:text-gray-600 rounded"
            on:click={toggleMinimize}
            title="Minimize Widget"
            role="button"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12h16"></path>
            </svg>
          </div>
          <!-- Edit Button -->
          <div
            class="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Edit Widget"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
          <!-- Delete Button -->
          <div
            class="p-1 text-gray-400 hover:text-red-600 rounded"
            on:click={deleteWidget}
            title="Delete Widget"
            role="button"
          >
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </div>
        </div>
      </div>
      <WidgetFactory {widget} />
    </button>