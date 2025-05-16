<script lang="ts">
  import { dashboardStore } from '$lib/stores/dashboardStore';
  
  // Get the selected widget (if any)
  $: selectedWidget = $dashboardStore.selectedWidgetId
    ? $dashboardStore.widgets.find(w => w.id === $dashboardStore.selectedWidgetId)
    : null;
    
  // Handle widget title change
  function updateTitle(event: Event) {
    const input = event.target as HTMLInputElement;
    if (selectedWidget) {
      dashboardStore.updateWidget(selectedWidget.id, {
        title: input.value
      });
    }
  }
  
  // Handle widget position/size changes
  function updateNumericProperty(property: 'x' | 'y' | 'width' | 'height', event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10) || 0;
    
    if (selectedWidget) {
      dashboardStore.updateWidget(selectedWidget.id, {
        [property]: value
      });
    }
  }
</script>

<div class="bg-white shadow-md rounded-lg p-4">
  <h2 class="font-medium text-lg mb-4">Properties</h2>
  
  {#if selectedWidget}
    <div class="space-y-4">
      <!-- Widget Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1" for="widget-title">
          Widget Title
        </label>
        <input
          id="widget-title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={selectedWidget.title}
          on:change={updateTitle}
        />
      </div>
      
      <!-- Position and Size -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="widget-x">
            X Position
          </label>
          <input
            id="widget-x"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedWidget.x}
            on:change={(e) => updateNumericProperty('x', e)}
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="widget-y">
            Y Position
          </label>
          <input
            id="widget-y"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedWidget.y}
            on:change={(e) => updateNumericProperty('y', e)}
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="widget-width">
            Width
          </label>
          <input
            id="widget-width"
            type="number"
            min="1"
            max="12"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedWidget.width}
            on:change={(e) => updateNumericProperty('width', e)}
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="widget-height">
            Height
          </label>
          <input
            id="widget-height"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedWidget.height}
            on:change={(e) => updateNumericProperty('height', e)}
          />
        </div>
      </div>
      
      <!-- Widget Type (read-only) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Widget Type
        </label>
        <div class="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-700">
          {selectedWidget.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </div>
      </div>
      
      <!-- TODO: Data Source -->
      <!-- TODO: Widget-specific settings -->
    </div>
  {:else}
    <div class="text-gray-500 text-sm">
      <p>No widget selected</p>
      <p class="mt-2">Select a widget on the canvas to edit its properties</p>
    </div>
  {/if}
</div>