<script lang="ts">
  import type { Widget } from '$lib/types/widgets';
  import { createEventDispatcher } from 'svelte';
  
  export let widget: Widget;
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  
  function handlePropertyChange(key: string, value: any) {
    dispatch('propertyChange', { key, value });
  }
  
  function handleDataSourceChange(source: string) {
    dispatch('dataSourceChange', { source });
  }
  
  function handleDataMappingChange(field: string, mapping: string) {
    dispatch('dataMappingChange', { field, mapping });
  }
</script>

<div class="widget-container" class:editing={isEditing}>
  <!-- <div class="widget-header">
    <h3>{widget.title}</h3>
    {#if isEditing}
      <div class="widget-controls">
        <button on:click={() => dispatch('edit')}>
          <span class="icon">⚙️</span>
        </button>
        <button on:click={() => dispatch('delete')}>
          <span class="icon">🗑️</span>
        </button>
      </div>
    {/if}
  </div> -->
  
  <div class="widget-content">
    <slot />
  </div>
</div>

<style>
  .widget-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .widget-container.editing {
    border: 2px dashed #4299e1;
  }
  
  .widget-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .widget-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
  }
  
  .widget-controls {
    display: flex;
    gap: 0.5rem;
  }
  
  .widget-controls button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .widget-controls button:hover {
    background-color: #edf2f7;
  }
  
  .widget-content {
    flex: 1;
    padding: 1rem;
    overflow: auto;
  }
  
  .icon {
    font-size: 1rem;
  }
</style>