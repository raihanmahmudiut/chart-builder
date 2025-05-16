<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { Widget } from '$lib/types/widgets';
  import BaseWidget from './BaseWidget.svelte';
  
  export let widget: Widget;
  export let isEditing = false;
  
  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // Define chart colors
  const chartColors = {
    background: [
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ],
    border: [
      'rgba(54, 162, 235, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)'
    ]
  };

  // Generate chart data based on widget type and settings
  function generateChartData() {
    let demoData;
    
    switch(widget.type) {
      case 'pie-chart':
        demoData = {
          labels: ['Product Sales', 'Services', 'Subscriptions', 'Consulting', 'Training'],
          data: [45000, 32000, 28000, 18000, 15000]
        };
        break;
      
      case 'bar-chart':
        demoData = {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          data: [28000, 35000, 42000, 48000]
        };
        break;
      
      case 'line-chart':
      default:
        demoData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [12000, 19000, 15000, 25000, 22000, 30000]
        };
        break;
    }

    return {
      labels: demoData.labels,
      datasets: [{
        label: widget.title,
        data: demoData.data,
        backgroundColor: widget.type === 'pie-chart' ? 
          chartColors.background : 
          chartColors.background[0],
        borderColor: widget.type === 'pie-chart' ? 
          chartColors.border :
          chartColors.border[0],
        borderWidth: 1,
        tension: widget.type === 'line-chart' ? 0.4 : undefined
      }]
    };
  }

  // Configure chart options based on type and settings
  function generateChartOptions() {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: 'easeOutQuart' as const
      },
      plugins: {
        legend: {
          display: widget.settings?.showLegend ?? true,
          position: 'top' as const,
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: widget.title,
          padding: {
            top: 10,
            bottom: 20
          },
          font: {
            size: 16,
            weight: 'bold' as const
          }
        }
      }
    };

    const typeSpecificOptions = widget.type === 'pie-chart' ? {
      plugins: {
        ...baseOptions.plugins,
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    } : {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: widget.yAxis || 'Value'
          }
        },
        x: {
          title: {
            display: true,
            text: widget.xAxis || 'Time'
          }
        }
      }
    };

    return { ...baseOptions, ...typeSpecificOptions, ...widget.settings };
  }
  
  $: chartConfig = {
    type: widget.type.replace('-chart', '') as 'line' | 'bar' | 'pie',
    data: generateChartData(),
    options: generateChartOptions()
  };
  
  function updateChart() {
    if (chart) {
      chart.data = chartConfig.data;
      chart.options = chartConfig.options as any; // Type assertion needed due to Chart.js typing limitations
      chart.update('none'); // Use 'none' for smoother transitions
    }
  }
  
  onMount(() => {
    chart = new Chart(canvas, chartConfig);
    console.log(chart, "chart", chart.data, "chart.data", chart.options, "chart.options");
  });
  
  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
  
  $: if (chart && (widget.settings || widget.title)) {
    updateChart();
  }
</script>

<BaseWidget {widget} {isEditing} on:edit on:delete on:propertyChange>
  <div class="chart-container">
    <canvas bind:this={canvas}></canvas>
  </div>
</BaseWidget>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
  }
</style>