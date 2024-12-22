<template>
  <div>
    <Card class="shadow-sm card">
      <template #title>
        <h2 class="text-xl font-semibold text-slate-800">User Analytics</h2>
      </template>
      <template #content>
        <div class="p-4 flex flex-col gap-4">
          <!-- User Selection -->
          <Dropdown
            :options="userOptions"
            optionLabel="label"
            placeholder="Select User"
            v-model="selectedUser"
          />

          <!-- Month Selection -->
          <Dropdown
            :options="monthOptions"
            placeholder="Select Month"
            v-model="selectedMonth"
          />

          <!-- Fetch and Display Graphs -->
          <Button
            label="Fetch Analytics"
            icon="pi pi-chart-bar"
            @click="fetchAnalytics"
          />
          
            <div v-if="isLoading" class="text-center">
              <i class="pi pi-spin pi-spinner text-blue-500 text-2xl"></i>
            </div>

            <div v-if="!isLoading && dailyUsageData.labels.length">
              <h3 class="text-lg font-semibold">Daily Water Usage</h3>
              <ReadingsChart 
                :readings="dailyUsageData" 
                chartType="line" 
                xLabel="Day of the Month" 
                yLabel="Gallons of Water Consumed"
              />
            </div>

            <div v-if="!isLoading && motorUsageData.labels.length">
              <h3 class="text-lg font-semibold">Motor Usage During Peak vs. Normal Hours</h3>
              <ReadingsChart 
                :readings="motorUsageData" 
                chartType="bar" 
                xLabel="Day of the Month" 
                yLabel="Number of Times Used"
              />
            </div>
         
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import axios from "axios";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import ReadingsChart from "@/components/ReadingsChart.vue";
import Card from "primevue/card";
import { ref, onMounted } from "vue";

// Configuring API URL
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Loading and dropdown state
const isLoading = ref(false);
const userOptions = ref([]);
const monthOptions = ref([
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]);

const selectedUser = ref(null);
const selectedMonth = ref(null);

// Data for charts
const dailyUsageData = ref({ labels: [], datasets: [] });
const motorUsageData = ref({ labels: [], datasets: [] });
const xAxis = ref([]);
const yAxis = ref([]);

// Fetch users from the API
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/analytics/users`);
    userOptions.value = response.data.users.map((user) => ({
      label: `${user.name} (${user.id})`,
      value: user.id,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const fetchAnalytics = async () => {
  if (!selectedUser.value || !selectedMonth.value) {
    alert("Please select both user and month.");
    return;
  }

  try {
    const userId = selectedUser.value?.value;
    const month = selectedMonth.value.value;

    isLoading.value = true;

    const params = { userId, month };

    // Fetch daily water usage data
    const dailyUsageResponse = await axios.get(`${API_URL}/api/user/analytics/daily-water-usage`, {
      params: { userId, month },
    });

    if (dailyUsageResponse.data.xAxis && dailyUsageResponse.data.yAxis) {
      dailyUsageData.value = {
        labels: dailyUsageResponse.data.xAxis,
        datasets: [
          {
            label: 'Water Usage',
            data: dailyUsageResponse.data.yAxis,
            fill: false,
            borderColor: 'blue',
            tension: 0.1,
          }
        ],
      };

      xAxis.value = dailyUsageResponse.data.xAxis;
      yAxis.value = dailyUsageResponse.data.yAxis;

      console.log(xAxis.value);
      console.log(yAxis.value);
    } else {
      dailyUsageData.value = { labels: [], datasets: [] };
    }

    // Fetch motor usage data
    const motorUsageResponse = await axios.get(`${API_URL}/api/user/analytics/motor-usage`, {
      params: { userId, month },
    });

    if (motorUsageResponse.data.xAxis && motorUsageResponse.data.peakYAxis && motorUsageResponse.data.normalYAxis) {
      motorUsageData.value = {
        labels: motorUsageResponse.data.xAxis,
        datasets: [
          {
            label: 'Peak Usage',
            data: motorUsageResponse.data.peakYAxis,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red
            borderColor: 'rgba(255, 99, 132, 1)', // Red
            borderWidth: 1,
          },
          {
            label: 'Normal Usage',
            data: motorUsageResponse.data.normalYAxis,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light green
            borderColor: 'rgba(75, 192, 192, 1)', // Green
            borderWidth: 1,
          }
        ],
      };
    } else {
      motorUsageData.value = { labels: [], datasets: [] };
    }

  } catch (error) {
    console.error("Error fetching analytics:", error);
    alert("Failed to fetch analytics. Please try again later.");
  } finally {
    isLoading.value = false;
  }
};


onMounted(fetchUsers);
</script>

<style scoped>
.card{
  margin: 2rem;
}
</style>
