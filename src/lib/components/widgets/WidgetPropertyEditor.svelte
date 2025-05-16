<script lang="ts">
  import type { Widget, WidgetType } from '$lib/types/widgets';
  import { createEventDispatcher } from 'svelte';
  
  export let widget: Widget;
  
  const dispatch = createEventDispatcher();
  
  const commonProperties = [
    { key: 'title', label: 'Title', type: 'text' , options: []},
    { key: 'dataSource', label: 'Data Source', type: 'select', options: [] }
  ];
  
  const typeSpecificProperties: Record<WidgetType, Array<{ key: string; label: string; type: 'text' | 'select' | 'checkbox' | 'number' | 'textarea'; options?: string[] }>> = {
    'line-chart': [
      { key: 'xAxis', label: 'X-Axis Field', type: 'text' },
      { key: 'yAxis', label: 'Y-Axis Field', type: 'text' },
      { key: 'settings.showLegend', label: 'Show Legend', type: 'checkbox' }
    ],
    'bar-chart': [
      { key: 'xAxis', label: 'X-Axis Field', type: 'text' },
      { key: 'yAxis', label: 'Y-Axis Field', type: 'text' },
      { key: 'settings.showLegend', label: 'Show Legend', type: 'checkbox' }
    ],
    'pie-chart': [
      { key: 'labelField', label: 'Label Field', type: 'text' },
      { key: 'valueField', label: 'Value Field', type: 'text' },
      { key: 'settings.showLegend', label: 'Show Legend', type: 'checkbox' }
    ],
    'kpi-card': [
      { key: 'settings.format', label: 'Number Format', type: 'select', options: ['number', 'currency', 'percent'] },
      { key: 'settings.target', label: 'Target Value', type: 'number' },
      { key: 'settings.showTrend', label: 'Show Trend', type: 'checkbox' }
    ],
    'data-table': [
      { key: 'settings.pageSize', label: 'Page Size', type: 'number' },
      { key: 'settings.sortable', label: 'Sortable Columns', type: 'checkbox' },
      { key: 'settings.filterable', label: 'Filterable', type: 'checkbox' }
    ],
    'text-block': [
      { key: 'settings.content', label: 'Content', type: 'textarea' },
      { key: 'settings.textAlign', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] }
    ],
    'image': [
      { key: 'settings.url', label: 'Image URL', type: 'text' },
      { key: 'settings.alt', label: 'Alt Text', type: 'text' },
      { key: 'settings.fit', label: 'Object Fit', type: 'select', options: ['contain', 'cover', 'fill'] }
    ]
  };
  
  $: properties = [...commonProperties, ...(typeSpecificProperties[widget.type] || [])];
  
  function handlePropertyChange(key: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let value: string | number | boolean = target.value;
    
    if (target.type === 'checkbox') {
      value = (target as HTMLInputElement).checked;
    } else if (target.type === 'number') {
      value = parseFloat(value);
    }
    
    const keyPath = key.split('.');
    dispatch('propertyChange', { key: keyPath[0], value: keyPath.length > 1 ? { [keyPath[1]]: value } : value });
  }
</script>

<div class="property-editor">
  <h3>Widget Properties</h3>
  
  <div class="properties-list">
    {#each properties as prop}
      <div class="property-item">
        <label for={prop.key}>{prop.label}</label>
        
        {#if prop.type === 'select'}
          <select
            id={prop.key}
            value={prop.key.includes('.') ? widget.settings[prop.key.split('.')[1]] : widget[prop.key]}
            on:change={(e) => handlePropertyChange(prop.key, e)}
          >
            {#if prop.options}
              {#each prop.options as option}
                <option value={option}>{option}</option>
              {/each}
            {/if}
          </select>
        
        {:else if prop.type === 'checkbox'}
          <input
            type="checkbox"
            id={prop.key}
            checked={prop.key.includes('.') ? widget.settings[prop.key.split('.')[1]] : widget[prop.key]}
            on:change={(e) => handlePropertyChange(prop.key, e)}
          />
        
        {:else if prop.type === 'textarea'}
          <textarea
            id={prop.key}
            value={prop.key.includes('.') ? widget.settings[prop.key.split('.')[1]] : widget[prop.key]}
            on:input={(e) => handlePropertyChange(prop.key, e)}
          ></textarea>
        
        {:else}
          <input
            type={prop.type}
            id={prop.key}
            value={prop.key.includes('.') ? widget.settings[prop.key.split('.')[1]] : widget[prop.key]}
            on:input={(e) => handlePropertyChange(prop.key, e)}
          />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .property-editor {
    padding: 1rem;
    background-color: #f7fafc;
    border-radius: 8px;
  }
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #2d3748;
  }
  
  .properties-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .property-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }
  
  input[type="text"],
  input[type="number"],
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  select {
    background-color: white;
  }
  
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
  }
</style>