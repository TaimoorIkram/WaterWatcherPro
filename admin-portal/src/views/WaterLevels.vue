<template>
    <div class="p-6 bg-white rounded-lg shadow-md space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-black">Water Level</h2>
        <div :class="['px-3 py-1 rounded-full text-sm font-medium', statusClass]">
          {{ status }}
        </div>
      </div>
  
      <div class="relative flex items-center justify-center w-48 h-24 border-2 border-gray-300 rounded-lg overflow-hidden">
        <div
          class="absolute bottom-0 left-0 w-full bg-blue-500"
          :style="{ height: waterLevelPercentage + '%' }"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center text-black font-semibold">
          {{ waterLevelPercentage }}%
        </div>
      </div>
  
      <button
        @click="fetchLatestReading"
        class="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Refresh
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        waterLevelPercentage: 0, // Water level percentage
        status: "Offline", // Status indicator (default to Offline)
      };
    },
    computed: {
      statusClass() {
        return this.status === "Online"
          ? "bg-green-500 text-white"
          : "bg-gray-300 text-gray-700";
      },
    },
    methods: {
      async fetchLatestReading() {
        try {
          const response = await fetch("http://localhost:3001/readings/latest/");
          if (!response.ok) {
            throw new Error("Failed to fetch latest readings.");
          }
  
          const data = await response.json();
          this.waterLevelPercentage = data.waterLevel || 0; // Assuming response includes waterLevel
          this.status = data.isOnline ? "Online" : "Offline"; // Assuming response includes isOnline
        } catch (error) {
          console.error("Error fetching latest readings:", error);
          this.status = "Offline"; // Set to offline if an error occurs
        }
      },
    },
    mounted() {
      this.fetchLatestReading();
    },
  };
  </script>
  
  <style scoped>
  .relative {
    height: 100%;
    display: flex;
    flex-direction: column-reverse; /* To start filling from the bottom */
  }
  </style>
  