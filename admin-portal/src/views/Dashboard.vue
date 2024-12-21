<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Main Content Area - Better section spacing -->
    <main class="pt-20 pb-8">
      <!-- Page Header -->
      <div class="max-w-[2000px] mx-auto px-8 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Water Watcher Pro</h1>
            <p class="mt-2 text-slate-600">
              Real-time sensor data and analytics
            </p>
          </div>
        </div>
      </div>
      <!-- Dashboard Content - Improved spacing and layout -->
      <div class="max-w-[2000px] mx-auto px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Main Content Area -->
          <div class="lg:col-span-3 space-y-8">
            <!-- Chart Card -->
            <Card class="shadow-sm">
              <template #title>
                <div
                  class="px-6 py-4 flex items-center justify-between border-b border-slate-200"
                >
                  <div>
                    <h2 class="text-xl font-semibold text-slate-800">
                      Water Level Trends
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                      Historical water level data
                    </p>
                  </div>
                  <div class="flex items-center gap-4">
                    <Dropdown
                      v-model="selectedTimeRange"
                      :options="timeRanges"
                      class="w-48"
                    />
                    <Button icon="pi pi-download" severity="secondary" text />
                  </div>
                </div>
              </template>
              <template #content>
                <div class="p-6">
                  <div
                    v-if="isLoading"
                    class="flex items-center justify-center h-[500px]"
                  >
                    <i
                      class="pi pi-spin pi-spinner text-4xl text-slate-400"
                    ></i>
                  </div>
                  <div
                    v-else-if="error"
                    class="flex items-center justify-center h-[500px] text-red-500"
                  >
                    <i class="pi pi-exclamation-circle mr-2"></i>
                    Failed to load chart data
                  </div>
                  <ReadingsChart
                    v-else
                    :readings="readings"
                    class="h-[500px]"
                  />
                </div>
              </template>
            </Card>

            <!-- Readings Table -->
            <Card class="shadow-sm">
              <template #title>
                <div
                  class="px-6 py-4 flex items-center justify-between border-b border-slate-200"
                >
                  <div>
                    <h2 class="text-xl font-semibold text-slate-800">
                      Recent Readings
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                      Last updated: {{ new Date().toLocaleTimeString() }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <Button
                      icon="pi pi-filter"
                      label="Filter"
                      severity="secondary"
                      text
                    />
                    <Button
                      icon="pi pi-download"
                      label="Export"
                      severity="secondary"
                      text
                    />
                  </div>
                </div>
              </template>
              <template #content>
                <div class="px-6 py-4">
                  <DataTable
                    :value="readings"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]"
                    stripedRows
                    responsiveLayout="scroll"
                    class="p-datatable-lg"
                  >
                    <Column field="sensorId" header="Sensor ID" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center">
                          <div
                            class="w-2 h-2 rounded-full bg-blue-500 mr-2"
                          ></div>
                          <span class="font-medium">{{ data.sensorId }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="waterLevel" header="Water Level" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center">
                          <i
                            :class="[
                              'pi mr-2 text-lg',
                              data.waterLevel > 80
                                ? 'pi-arrow-up text-red-500'
                                : data.waterLevel > 50
                                ? 'pi-arrow-right text-yellow-500'
                                : 'pi-arrow-down text-emerald-500',
                            ]"
                          ></i>
                          <span class="font-medium">{{
                            data.waterLevel.toFixed(2)
                          }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="timestamp" header="Time" sortable>
                      <template #body="{ data }">
                        <div class="flex items-center gap-2">
                          <i class="pi pi-clock text-slate-400"></i>
                          <span>{{
                            new Date(data.timestamp).toLocaleString()
                          }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="actionTaken" header="Status" sortable>
                      <template #body="{ data }">
                        <Tag
                          :severity="data.actionTaken ? 'success' : 'info'"
                          :value="
                            data.actionTaken ? 'Action Taken' : 'Monitoring'
                          "
                          class="text-sm"
                        />
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </template>
            </Card>
          </div>

          <!-- Right Sidebar - Forms with better spacing -->
          <div class="space-y-8">
            <!-- Add Sensor Form -->
            <Card class="shadow-sm">
              <template #title>
                <div class="px-6 py-4 border-b border-slate-200">
                  <h2 class="text-xl font-semibold text-slate-800">
                    Add New Sensor
                  </h2>
                  <p class="mt-1 text-sm text-slate-500">
                    Configure a new water level sensor
                  </p>
                </div>
              </template>
              <template #content>
                <div class="p-6">
                  <form @submit.prevent="addSensor" class="space-y-6">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-700"
                        >Sensor ID</label
                      >
                      <InputText
                        v-model="newSensor.sensorId"
                        class="w-full p-inputtext-lg"
                        placeholder="Enter sensor ID"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-700"
                        >Threshold</label
                      >
                      <InputNumber
                        v-model="newSensor.threshold"
                        class="w-full"
                        placeholder="Set water level threshold"
                      />
                      <p class="text-xs text-slate-500">
                        Set the threshold for alerts
                      </p>
                    </div>
                    <Button
                      type="submit"
                      label="Add Sensor"
                      icon="pi pi-plus"
                      class="w-full p-button-lg"
                    />
                  </form>
                </div>
              </template>
            </Card>

            <!-- Add Mapping Form -->
            <Card class="shadow-sm">
              <template #title>
                <div class="px-6 py-4 border-b border-slate-200">
                  <h2 class="text-xl font-semibold text-slate-800">
                    Configure Mapping
                  </h2>
                  <p class="mt-1 text-sm text-slate-500">
                    Link sensors with actuators
                  </p>
                </div>
              </template>
              <template #content>
                <div class="p-6">
                  <form @submit.prevent="addMapping" class="space-y-6">
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-700"
                        >Sensor ID</label
                      >
                      <InputText
                        v-model="newMapping.sensorId"
                        class="w-full"
                        placeholder="Select sensor"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-slate-700"
                        >Actuator ID</label
                      >
                      <InputText
                        v-model="newMapping.actuatorId"
                        class="w-full"
                        placeholder="Select actuator"
                      />
                    </div>
                    <Button
                      type="submit"
                      label="Create Mapping"
                      icon="pi pi-link"
                      severity="secondary"
                      class="w-full p-button-lg"
                    />
                  </form>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </div>
  <!-- Sensors Table -->
  <Card class="shadow-sm">
    <template #title>
      <div
        class="px-6 py-4 flex items-center justify-between border-b border-slate-200"
      >
        <div>
          <h2 class="text-xl font-semibold text-slate-800">
            Configured Sensors
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            All registered water level sensors
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-plus"
            label="Add Sensor"
            severity="secondary"
            text
          />
          <Button
            icon="pi pi-download"
            label="Export"
            severity="secondary"
            text
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="px-6 py-4">
        <DataTable
          :value="sensors"
          :paginator="true"
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          stripedRows
          responsiveLayout="scroll"
          class="p-datatable-lg"
        >
          <Column field="sensorId" header="Sensor ID" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span class="font-medium">{{ data.sensorId }}</span>
              </div>
            </template>
          </Column>
          <Column field="threshold" header="Threshold" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-flag text-yellow-500 mr-2"></i>
                <span class="font-medium">{{ data.threshold }}</span>
              </div>
            </template>
          </Column>
          <Column header="Status">
            <template #body>
              <Tag severity="success" value="Active" />
            </template>
          </Column>
          <Column header="Actions">
            <template #body>
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" severity="secondary" text />
                <Button icon="pi pi-trash" severity="danger" text />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>

  <!-- Actuator Mappings Table -->
  <Card class="shadow-sm">
    <template #title>
      <div
        class="px-6 py-4 flex items-center justify-between border-b border-slate-200"
      >
        <div>
          <h2 class="text-xl font-semibold text-slate-800">
            Actuator Mappings
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            Sensor-actuator connection configurations
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-plus"
            label="Add Mapping"
            severity="secondary"
            text
          />
          <Button
            icon="pi pi-download"
            label="Export"
            severity="secondary"
            text
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="px-6 py-4">
        <DataTable
          :value="actuatorMappings"
          :paginator="true"
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          stripedRows
          responsiveLayout="scroll"
          class="p-datatable-lg"
        >
          <Column field="sensorId" header="Sensor ID" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span class="font-medium">{{ data.sensorId }}</span>
              </div>
            </template>
          </Column>
          <Column field="actuatorId" header="Actuator ID" sortable>
            <template #body="{ data }">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span class="font-medium">{{ data.actuatorId }}</span>
              </div>
            </template>
          </Column>
          <Column header="Status">
            <template #body>
              <Tag severity="success" value="Connected" />
            </template>
          </Column>
          <Column header="Actions">
            <template #body>
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" severity="secondary" text />
                <Button icon="pi pi-trash" severity="danger" text />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import ReadingsChart from "@/components/ReadingsChart.vue";

const API_URL = "http://localhost:3000";
const readings = ref([]);
const analytics = ref({});
const newSensor = ref({ sensorId: "", threshold: null });
const newMapping = ref({ sensorId: "", actuatorId: "" });
const isLoading = ref(false);
const error = ref(null);

const selectedTimeRange = ref("24h");
const timeRanges = ref([
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last Week", value: "7d" },
  { label: "Last Month", value: "30d" },
]);

// API Calls
const fetchReadings = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await axios.get(`${API_URL}/readings`);
    readings.value = response.data;
  } catch (error) {
    console.error("Error fetching readings:", error);
    error.value = error;
  } finally {
    isLoading.value = false;
  }
};

const fetchAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    analytics.value = response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
  }
};

const addSensor = async () => {
  try {
    await axios.post(`${API_URL}/sensors`, newSensor.value);
    newSensor.value = { sensorId: "", threshold: null };
    alert("Sensor added successfully");
  } catch (error) {
    console.error("Error adding sensor:", error);
    alert("Error adding sensor");
  }
};

const addMapping = async () => {
  try {
    await axios.post(`${API_URL}/mappings`, newMapping.value);
    newMapping.value = { sensorId: "", actuatorId: "" };
    alert("Mapping added successfully");
  } catch (error) {
    console.error("Error adding mapping:", error);
    alert("Error adding mapping");
  }
};

// Add these to your existing refs
const sensors = ref([]);
const actuatorMappings = ref([]);

// Add these fetch functions
const fetchSensors = async () => {
  try {
    const response = await axios.get(`${API_URL}/sensors`);
    sensors.value = response.data;
  } catch (error) {
    console.error("Error fetching sensors:", error);
  }
};

const fetchMappings = async () => {
  try {
    const response = await axios.get(`${API_URL}/mappings`);
    actuatorMappings.value = response.data;
  } catch (error) {
    console.error("Error fetching mappings:", error);
  }
};

onMounted(() => {
  // Initial fetches
  fetchReadings();
  fetchAnalytics();
  fetchSensors();
  fetchMappings();

  // More frequent updates for readings (every 5 seconds)
  const readingsInterval = setInterval(() => {
    fetchReadings();
    fetchAnalytics();
  }, 10000);

  // Less frequent updates for configuration data (every 30 seconds)
  const configInterval = setInterval(() => {
    fetchSensors();
    fetchMappings();
  }, 30000);

  // Clean up intervals on unmount
  onUnmounted(() => {
    clearInterval(readingsInterval);
    clearInterval(configInterval);
  });
});
</script>

<style>
/* Add these custom styles */
.p-card {
  border-radius: 0.75rem;
}

.p-card .p-card-content {
  padding: 0;
}

.p-inputtext {
  border-radius: 0.5rem;
}

.p-button {
  border-radius: 0.5rem;
}

.p-datatable .p-datatable-header {
  background: transparent;
  border: none;
}

.p-datatable .p-datatable-thead > tr > th {
  background: transparent;
  border-width: 0 0 1px 0;
}

.p-dropdown {
  border-radius: 0.5rem;
}

:root {
  --primary-color: #2563eb;
  --primary-color-text: #ffffff;
}

.p-card {
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.p-card .p-card-content {
  padding: 0;
}

.p-inputtext,
.p-dropdown,
.p-button {
  border-radius: 0.375rem;
}

.p-button.p-button-text:enabled:hover {
  background: #f1f5f9;
}

.p-datatable .p-datatable-header {
  background: transparent;
  border: none;
}

.p-datatable .p-datatable-thead > tr > th {
  background: transparent;
  border-width: 0 0 1px 0;
  color: #475569;
  font-weight: 600;
}

.p-datatable .p-datatable-tbody > tr {
  transition: background-color 0.2s;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #f8fafc;
}

.p-tag {
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
}
</style>
