<template>
  <v-card class="data-source-panel" elevation="2">
    <v-card-title class="text-lg font-medium">Data Sources</v-card-title>
    <v-card-text class="pa-4">
      <!-- Upload CSV -->
      <div class="mb-4">
        <v-file-input
          v-model="uploadedFile"
          label="Upload CSV File"
          accept=".csv"
          prepend-icon="mdi-file-delimited"
          variant="outlined"
          density="compact"
          @update:model-value="handleFileUpload"
        />
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

