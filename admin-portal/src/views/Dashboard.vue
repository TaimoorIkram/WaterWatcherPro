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
        <div class="mb-4">
          <label for="device-select" class="block mb-2 text-sm font-medium text-slate-700">Select Device</label>
          <select id="device-select" v-model="selectedDevice" @change="fetchReadings" class="block w-full p-2 border rounded-md">
            <option v-for="device in devices" :key="device.id" :value="device.id">
              {{ device.name }} (ID: {{ device.id }})
            </option>
          </select>
        </div>
        <DataTable 
          v-if="readings.length > 0"
          :value="readings" 
          :loading="isLoading"
          paginator 
          :rows="10" 
          :rowsPerPageOptions="[10,20,50]"
          stripedRows
          responsiveLayout="scroll"
          class="p-4"
          class="p-4"
        >
          <!-- Timestamp Column -->
          <Column field="createdAt" header="Timestamp" sortable>
            <template #body="slotProps">
              {{ formatTimestamp(slotProps.data.createdAt) }}
            </template>
          </Column>

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

          <!-- Sensor ID Column -->
          <Column field="deviceId" header="Sensor ID" sortable>
            <template #body="slotProps">
              <div class="flex items-center">
                <i class="pi pi-inbox mr-2 text-blue-500"></i>
                Sensor {{ slotProps.data.deviceId }}
              </div>
            </template>
          </Column>
        </DataTable>
        <div v-else class="text-center text-sm text-slate-600">
          No readings found for the selected device.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user.store"; // Import the user store
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Configuring API URL
const API_URL = "http://localhost:3001";
const userStore = useUserStore(); // Initialize the user store

// Loading and dropdown state
const isLoading = ref(false);
const devices = ref([]);
const selectedDevice = ref(null);
const readings = ref([]);

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// Fetch devices from the API
const fetchDevices = async () => {
  try {
    const token = userStore.getAccessToken(); // Get the token from the user store

    // Set up headers with the token
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const response = await axios.get(`${API_URL}/devices`, { headers }); // Include headers with the token
    devices.value = response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
  }
};

const fetchReadings = async () => {
  if (!selectedDevice.value) return;
  try {
    isLoading.value = true;
    const token = userStore.getAccessToken(); // Get the token from the user store

    // Set up headers with the token
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const response = await axios.get(`${API_URL}/devices/${selectedDevice.value}`, { headers }); // Include headers with the token
    readings.value = response.data;
  } catch (error) {
    console.error('Error fetching readings:', error);
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchDevices();
});
</script>

<style scoped>
:deep(.p-datatable) {
<style scoped>
:deep(.p-datatable) {
  border-radius: 0.5rem;
}

:deep(.p-card) {
  border-radius: 1rem;
:deep(.p-card) {
  border-radius: 1rem;
}

:deep(.p-column-title) {
:deep(.p-column-title) {
  font-weight: 600;
  color: #475569;
  color: #475569;
}

:deep(.p-paginator) {
  padding: 1rem;
:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8fafc;
}

:deep(.p-datatable-header) {
  background: #f8fafc;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
:deep(.p-datatable-header) {
  background: #f8fafc;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>