<script lang="ts">
    import WidgetPalette from '$lib/components/builder/WidgetPalette.svelte';
    import DashboardCanvas from '$lib/components/builder/DashboardCanvas.svelte';
    import PropertyEditor from '$lib/components/builder/PropertyEditor.svelte';
    import { dashboardStore } from '$lib/stores/dashboardStore';
	import MinimizedWidgetsContainer from '$lib/components/builder/MinimizedWidgetsContainer.svelte';
    
    // Header controls
    function clearDashboard() {
      if (confirm('Are you sure you want to clear the dashboard? This action cannot be undone.')) {
        dashboardStore.clearDashboard();
      }
    }
    
    function saveDashboard() {
      // In Phase 1, just alert saved state
      // In future phases, implement actual saving to backend/file
      alert('Dashboard saved to local storage');
    }
  </script>
  
  <svelte:head>
    <title>Dashboard Builder</title>
  </svelte:head>
  
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class=" px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Dashboard Builder</h1>
            <input
              class="ml-4 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              type="text"
              placeholder="Dashboard title"
              value={$dashboardStore.title}
              on:change={(e) => dashboardStore.update(d => ({ ...d, title: (e.target as HTMLInputElement).value }))}
            />
          </div>
          
          <div class="flex space-x-3">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={clearDashboard}
            >
              Clear
            </button>
            
            <button
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={saveDashboard}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-12 gap-6">
        <!-- Left Sidebar - Widget Palette -->
        <div class="col-span-2">
          <WidgetPalette />
        </div>
        
        <!-- Main Canvas Area -->
        <div class="col-span-8">
          <DashboardCanvas />
        </div>
        
        <!-- Right Sidebar - Property Editor -->
        <div class="col-span-2 flex flex-col space-y-2">
          <PropertyEditor />
          <MinimizedWidgetsContainer />
        </div>
      </div>
    </main>
  </div>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
    }
  </style>