<template>
    <div>
      <Card class="shadow-sm card">
        <template #title>
          <h2 class="text-xl font-semibold text-slate-800">Community Analytics</h2>
        </template>
        <template #content>
          <div class="p-4 flex flex-col gap-4">
            <!-- Month Selection -->
            <Dropdown
              :options="monthOptions"
              optionLabel="label"
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
  
            <div v-if="!isLoading && noData">
              <p class="text-center text-lg text-red-500">No data found for the selected month.</p>
            </div>
  
            <div v-if="!isLoading && !noData">
              <div v-if="averageDailyUsageData.labels.length">
                <h3 class="text-lg font-semibold">Average Daily Water Usage</h3>
                <ReadingsChart 
                  :readings="averageDailyUsageData" 
                  chartType="line" 
                  xLabel="Day of the Month" 
                  yLabel="Average Gallons of Water Consumed"
                />
              </div>
  
              <div v-if="communityMotorUsageData.labels.length">
                <h3 class="text-lg font-semibold">Community Motor Usage Patterns</h3>
                <ReadingsChart 
                  :readings="communityMotorUsageData" 
                  chartType="bar" 
                  xLabel="Day of the Month" 
                  yLabel="Number of Times Motor Used (Peak and Normal)"
                />
              </div>
  
              <div v-if="userRankingsData.labels.length">
                <h3 class="text-lg font-semibold">User Rankings by Water Consumption</h3>
                <ReadingsChart 
                  :readings="userRankingsData" 
                  chartType="bar" 
                  xLabel="Users" 
                  yLabel="Total Water Consumption (Gallons)"
                  horizontalBar
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref, computed } from "vue";
  import { useUserStore } from "@/stores/user.store"; // Import the user store
  import Dropdown from "primevue/dropdown";
  import Button from "primevue/button";
  import ReadingsChart from "@/components/ReadingsChart.vue";
  import Card from "primevue/card";
  
  // Configuring API URL
  const API_URL = "http://localhost:3001";
  const userStore = useUserStore(); // Initialize the user store
  
  // Loading and dropdown state
  const isLoading = ref(false);
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
  
  const selectedMonth = ref(null);
  
  // Data for charts
  const averageDailyUsageData = ref({ labels: [], datasets: [] });
  const communityMotorUsageData = ref({ labels: [], datasets: [] });
  const userRankingsData = ref({ labels: [], datasets: [] });
  
  // Computed property to check if no data is available
  const noData = computed(() => 
    !averageDailyUsageData.value.labels.length && 
    !communityMotorUsageData.value.labels.length && 
    !userRankingsData.value.labels.length
  );
  
  const fetchAnalytics = async () => {
    if (!selectedMonth.value) {
      alert("Please select a month.");
      return;
    }
  
    const month = selectedMonth.value;
  
    try {
      isLoading.value = true;
      const token = userStore.getAccessToken(); // Get the token from the user store
      console.log(token)
  
      // Set up headers with the token
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      // Fetch average daily water usage data
      const averageDailyUsageResponse = await axios.get(`${API_URL}/api/community/analytics/average-daily-water-usage`, {
        params: { month },
        headers // Include headers with the token
      });
  
      if (averageDailyUsageResponse.data.xAxis && averageDailyUsageResponse.data.yAxis) {
        averageDailyUsageData.value = {
          labels: averageDailyUsageResponse.data.xAxis,
          datasets: [
            {
              label: 'Average Daily Water Usage',
              data: averageDailyUsageResponse.data.yAxis,
              fill: false,
              borderColor: 'blue',
              tension: 0.1,
            }
          ],
        };
      } else {
        averageDailyUsageData.value = { labels: [], datasets: [] };
      }
  
      // Fetch community motor usage data
      const communityMotorUsageResponse = await axios.get(`${API_URL}/api/community/analytics/motor-usage`, {
        params: { month },
        headers // Include headers with the token
      });
  
      if (communityMotorUsageResponse.data.xAxis && communityMotorUsageResponse.data.peakYAxis && communityMotorUsageResponse.data.normalYAxis) {
        communityMotorUsageData.value = {
          labels: communityMotorUsageResponse.data.xAxis,
          datasets: [
            {
              label: 'Peak Usage',
              data: communityMotorUsageResponse.data.peakYAxis,
              backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red
              borderColor: 'rgba(255, 99, 132, 1)', // Red
              borderWidth: 1,
            },
            {
              label: 'Normal Usage',
              data: communityMotorUsageResponse.data.normalYAxis,
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light green
              borderColor: 'rgba(75, 192, 192, 1)', // Green
              borderWidth: 1,
            }
          ],
        };
      } else {
        communityMotorUsageData.value = { labels: [], datasets: [] };
      }
  
      // Fetch user rankings data
      const userRankingsResponse = await axios.get(`${API_URL}/api/community/analytics/user-rankings`, {
        params: { month },
        headers // Include headers with the token
      });
  
      if (userRankingsResponse.data.xAxis && userRankingsResponse.data.yAxis) {
        userRankingsData.value = {
          labels: userRankingsResponse.data.xAxis,
          datasets: [
            {
              label: 'Total Water Consumption',
              data: userRankingsResponse.data.yAxis,
              backgroundColor: 'rgba(153, 102, 255, 0.2)', // Light purple
              borderColor: 'rgba(153, 102, 255, 1)', // Purple
              borderWidth: 1,
            }
          ],
        };
      } else {
        userRankingsData.value = { labels: [], datasets: [] };
      }
  
    } catch (error) {
      console.error("Error fetching community analytics:", error);
      alert("Failed to fetch community analytics. Please try again later.");
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .card {
    margin: 2rem;
  }
  </style>
  