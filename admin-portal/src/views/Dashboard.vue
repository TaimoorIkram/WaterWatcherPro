<template>
  <div class="min-h-screen bg-slate-50 p-8">
    <Card class="shadow-lg">
      <template #title>
        <div class="pb-4">
          <h1 class="text-2xl font-bold text-slate-900">Water Level Readings</h1>
          <p class="mt-2 text-sm text-slate-600">Historical sensor data</p>
        </div>
      </template>
      
      <template #content>
        <DataTable 
          :value="readings" 
          :loading="isLoading"
          paginator 
          :rows="10" 
          :rowsPerPageOptions="[10,20,50]"
          stripedRows
          responsiveLayout="scroll"
          class="p-4"
        >
          <!-- Date Column -->
          <Column header="Date" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data) }}
            </template>
          </Column>

          <!-- Time Column -->
          <Column field="time" header="Time" sortable />

          <!-- Water Level Column -->
          <Column field="water_level" header="Water Level" sortable>
            <template #body="slotProps">
              <div class="flex items-center">
                <i :class="[
                  'pi mr-2',
                  slotProps.data.water_level < 0.05 ? 'pi-arrow-down text-red-500' :
                  slotProps.data.water_level < 0.1 ? 'pi-arrow-right text-yellow-500' :
                  'pi-arrow-up text-green-500'
                ]"></i>
                {{ slotProps.data.water_level.toFixed(2) }} m
              </div>
            </template>
          </Column>

          <!-- Motor State Column -->
          <Column field="motor_power_state" header="Motor State" sortable>
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.motor_power_state ? 'success' : 'danger'"
                :value="slotProps.data.motor_power_state ? 'ON' : 'OFF'"
              />
            </template>
          </Column>

          <!-- Sensor ID Column -->
          <Column field="sensor_id" header="Sensor ID" sortable>
            <template #body="slotProps">
              <div class="flex items-center">
                <i class="pi pi-inbox mr-2 text-blue-500"></i>
                Sensor {{ slotProps.data.sensor_id }}
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const readings = ref([])
const isLoading = ref(false)

const formatDate = (reading) => {
  return `${reading.day}/${reading.month}/${reading.year}`
}

const fetchReadings = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:3001/readings')
    readings.value = response.data
  } catch (error) {
    console.error('Error fetching readings:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchReadings()
})
</script>

<style scoped>
:deep(.p-datatable) {
  border-radius: 0.5rem;
}

:deep(.p-card) {
  border-radius: 1rem;
}

:deep(.p-column-title) {
  font-weight: 600;
  color: #475569;
}

:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8fafc;
}

:deep(.p-datatable-header) {
  background: #f8fafc;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>