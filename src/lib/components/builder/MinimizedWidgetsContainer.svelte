<script lang="ts">
  import type { Widget } from '$lib/types/widgets';
  import { createEventDispatcher } from 'svelte';
  import { dashboardStore } from '$lib/stores/dashboardStore';

  const dispatch = createEventDispatcher();
  
  $: minimizedWidgets = $dashboardStore.widgets.filter(w => w.isMinimized);

  function handleSelect(widgetId: string) {
    dispatch('select', { id: widgetId });
  }
</script>

<style>
  .minimized-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .minimized-widget {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .minimized-widget:hover {
    background-color: #e6e6e6;
  }
</style>

<div class="minimized-container">
  {#each minimizedWidgets as widget}
    <div class="minimized-widget" on:click={() => {
      handleSelect(widget.id);
      dashboardStore.updateWidget(widget.id, { isMinimized: false });
    }}>
      <span>{widget.title}</span>
      <div class="controls">
        <!-- Delete Button -->
        <div
          class="p-1 text-gray-400 hover:text-red-600 rounded"
          on:click={() => dashboardStore.removeWidget(widget.id)}
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
  {/each}
</div>