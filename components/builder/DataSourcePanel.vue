<template>
  <v-card class="data-source-panel" elevation="2">
    <v-card-title class="text-lg font-medium">Data Sources</v-card-title>
    <v-card-text class="pa-4">
      <!-- Upload CSV -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">CSV Upload</span>
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                size="x-small"
                variant="text"
                color="primary"
                prepend-icon="mdi-download"
                v-bind="props"
              >
                Examples
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click="downloadExampleCSV('all')">
                <v-list-item-title>All Templates</v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadExampleCSV('timeseries')">
                <v-list-item-title>Time Series (Line/Bar)</v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadExampleCSV('categories')">
                <v-list-item-title>Categories (Pie Chart)</v-list-item-title>
              </v-list-item>
              <v-list-item @click="downloadExampleCSV('kpi')">
                <v-list-item-title>KPI Metrics</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        
        <v-file-input
          v-model="uploadedFile"
          label="Upload CSV File"
          accept=".csv"
          prepend-icon="mdi-file-delimited"
          variant="outlined"
          density="compact"
          @update:model-value="handleFileUpload"
        />
        
        <!-- Format Guide -->
        <v-expansion-panels variant="accordion" class="mt-2">
          <v-expansion-panel>
            <v-expansion-panel-title class="text-xs">
              <v-icon size="small" class="mr-2">mdi-information</v-icon>
              CSV Format Guide
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-xs">
              <div class="space-y-2">
                <p class="font-medium">Required format:</p>
                <ul class="list-disc list-inside space-y-1 text-gray-600">
                  <li>First row must contain column headers</li>
                  <li>Each row represents one data point</li>
                  <li>Use comma (,) as delimiter</li>
                </ul>
                
                <p class="font-medium mt-3">Example columns for charts:</p>
                <code class="block bg-gray-100 p-2 rounded text-xs">
                  date,category,value,label
                </code>
                
                <p class="font-medium mt-3">Example columns for KPI:</p>
                <code class="block bg-gray-100 p-2 rounded text-xs">
                  metric,value,target,trend
                </code>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!-- API Endpoint -->
      <div class="mb-4">
        <v-text-field
          v-model="apiEndpoint"
          label="API Endpoint"
          prepend-icon="mdi-api"
          variant="outlined"
          density="compact"
          placeholder="https://api.example.com/data"
        />
        <v-btn
          block
          color="primary"
          size="small"
          class="mt-2"
          @click="fetchFromAPI"
          :loading="isLoading"
        >
          Fetch Data
        </v-btn>
      </div>

      <!-- Data Sources List -->
      <div v-if="dataSources.length > 0" class="mt-4">
        <v-divider class="mb-3" />
        <h3 class="text-sm font-medium mb-2">Available Data Sources</h3>
        <v-list density="compact">
          <v-list-item
            v-for="source in dataSources"
            :key="source.id"
            :title="source.name"
            :subtitle="`${source.rows} rows, ${source.columns} columns`"
          >
            <template #prepend>
              <v-icon :icon="source.type === 'csv' ? 'mdi-file-delimited' : 'mdi-api'" />
            </template>
            <template #append>
              <v-btn
                icon
                size="x-small"
                variant="text"
                @click="deleteDataSource(source.id)"
              >
                <v-icon size="small">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-gray-500 text-sm py-4">
        <v-icon size="large" class="mb-2">mdi-database-off</v-icon>
        <p>No data sources yet</p>
        <p class="text-xs mt-1">Upload a CSV or connect to an API</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DataSource {
  id: string
  name: string
  type: 'csv' | 'api'
  data: any[]
  rows: number
  columns: number
}

const uploadedFile = ref<File[] | null>(null)
const apiEndpoint = ref('')
const isLoading = ref(false)
const dataSources = ref<DataSource[]>([])

const handleFileUpload = async (files: File[] | null) => {
  if (!files || files.length === 0) return
  
  const file = files[0]
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const text = e.target?.result as string
    const rows = parseCSV(text)
    
    if (rows.length > 0) {
      const dataSource: DataSource = {
        id: crypto.randomUUID(),
        name: file.name,
        type: 'csv',
        data: rows,
        rows: rows.length,
        columns: Object.keys(rows[0]).length
      }
      
      dataSources.value.push(dataSource)
      
      // Store in localStorage
      localStorage.setItem('dashboard-data-sources', JSON.stringify(dataSources.value))
      
      // Show success message
      alert(`Successfully uploaded ${file.name} with ${rows.length} rows`)
    }
  }
  
  reader.readAsText(file)
}

const parseCSV = (text: string): any[] => {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    data.push(row)
  }
  
  return data
}

const fetchFromAPI = async () => {
  if (!apiEndpoint.value) {
    alert('Please enter an API endpoint')
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await fetch(apiEndpoint.value)
    const data = await response.json()
    
    // Assume data is an array
    const dataArray = Array.isArray(data) ? data : [data]
    
    const dataSource: DataSource = {
      id: crypto.randomUUID(),
      name: new URL(apiEndpoint.value).hostname,
      type: 'api',
      data: dataArray,
      rows: dataArray.length,
      columns: dataArray.length > 0 ? Object.keys(dataArray[0]).length : 0
    }
    
    dataSources.value.push(dataSource)
    
    // Store in localStorage
    localStorage.setItem('dashboard-data-sources', JSON.stringify(dataSources.value))
    
    alert(`Successfully fetched ${dataArray.length} rows from API`)
  } catch (error) {
    alert(`Error fetching data: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const deleteDataSource = (id: string) => {
  dataSources.value = dataSources.value.filter(ds => ds.id !== id)
  localStorage.setItem('dashboard-data-sources', JSON.stringify(dataSources.value))
}

const downloadExampleCSV = (type: string = 'all') => {
  // Create example CSV data for different widget types
  const templates = {
    timeseries: {
      name: 'timeseries-example.csv',
      content: `date,revenue,expenses,profit
2024-01,45000,32000,13000
2024-02,52000,35000,17000
2024-03,48000,33000,15000
2024-04,61000,38000,23000
2024-05,58000,36000,22000
2024-06,67000,40000,27000`
    },
    
    categories: {
      name: 'categories-example.csv',
      content: `category,value,percentage
Product Sales,45000,35
Services,32000,25
Subscriptions,28000,22
Consulting,18000,14
Training,5000,4`
    },
    
    kpi: {
      name: 'kpi-example.csv',
      content: `metric,value,target,trend,format
Revenue,125000,150000,8.5,currency
Users,5420,6000,12.3,number
Conversion,3.2,4.0,-2.1,percent
Satisfaction,4.7,4.5,5.2,number`
    },
    
    all: {
      name: 'all-templates.csv',
      content: `# Time Series Data (for Line/Bar Charts)
# Use this format for charts that show data over time
date,revenue,expenses,profit
2024-01,45000,32000,13000
2024-02,52000,35000,17000
2024-03,48000,33000,15000

# Category Data (for Pie Charts)
# Use this format for charts that show proportions
category,value,percentage
Product Sales,45000,35
Services,32000,25
Subscriptions,28000,22

# KPI Metrics
# Use this format for KPI cards
metric,value,target,trend,format
Revenue,125000,150000,8.5,currency
Users,5420,6000,12.3,number

# Instructions:
# 1. Choose the section that matches your widget type
# 2. Remove the # comment lines
# 3. Keep only the data you need
# 4. Add your own data following the same format
# 5. Save and upload to the dashboard`
    }
  }

  const template = templates[type as keyof typeof templates] || templates.all
  
  // Create blob and download
  const blob = new Blob([template.content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = template.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Load data sources from localStorage on mount
if (process.client) {
  const stored = localStorage.getItem('dashboard-data-sources')
  if (stored) {
    try {
      dataSources.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to load data sources:', e)
    }
  }
}
</script>

<style scoped>
.data-source-panel {
  height: fit-content;
}
</style>

