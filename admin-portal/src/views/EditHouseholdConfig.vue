<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div class="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Household Configuration</h2>
        <form @submit.prevent="updateConfig" class="space-y-6">
          <!-- Household ID -->
          <div class="space-y-1">
            <label for="household_id" class="block text-sm font-medium text-gray-700">Household ID</label>
            <input
              type="text"
              id="household_id"
              v-model="form.household_id"
              disabled
              class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            />
          </div>
  
          <!-- Tank Height -->
          <div class="space-y-1">
            <label for="tank_height" class="block text-sm font-medium text-gray-700">Tank Height</label>
            <input
              type="number"
              id="tank_height"
              v-model="form.tank_height"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter tank height (in meters)"
            />
          </div>
  
          <!-- Tank Capacity -->
          <div class="space-y-1">
            <label for="tank_capacity" class="block text-sm font-medium text-gray-700">Tank Capacity</label>
            <input
              type="number"
              id="tank_capacity"
              v-model="form.tank_capacity"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter tank capacity (in liters)"
            />
          </div>
  
          <!-- Peak Usage Hours -->
          <div class="space-y-1">
            <label for="peak_usage_hours" class="block text-sm font-medium text-gray-700">Peak Usage Hours</label>
            <input
              type="text"
              id="peak_usage_hours"
              v-model="form.peak_usage_hours"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter peak usage hours"
            />
          </div>

          <div class="space-y-1">
            <label for="min_threshold_normal_hours" class="block text-sm font-medium text-gray-700">Min Threshold Normal Hours</label>
            <input
              type="number"
              id="min_threshold_normal_hours"
              v-model="form.min_threshold_normal_hours"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter minimum threshold of water level during normal hours"
            />
          </div>

          <div class="space-y-1">
            <label for="min_threshold_peak_hours" class="block text-sm font-medium text-gray-700">Min Threshold Peak Hours</label>
            <input
              type="number"
              id="min_threshold_peak_hours"
              v-model="form.min_threshold_peak_hours"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter minimum threshold of water level during peak hours"
            />
          </div>
  
          <!-- Water Availability Hours -->
          <div class="space-y-1">
            <label for="water_availability_hours" class="block text-sm font-medium text-gray-700">Water Availability Hours</label>
            <input
              type="text"
              id="water_availability_hours"
              v-model="form.water_availability_hours"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter water availability hours"
            />
          </div>
  
          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Update Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UpdateHouseholdConfig',
    data() {
      return {
        form: {
          household_id: '',
          tank_height: '',
          tank_capacity: '',
          peak_usage_hours: '',
          min_threshold_normal_hours: '',
          min_threshold_peak_hours: '',
          water_availability_hours: '',
        },
        exists: true,
      };
    },
    mounted() {
      this.loadConfig();
    },
    methods: {
      async loadConfig() {
        try {
          const configId = this.$route.params.id;
          
          const response = await fetch(`http://localhost:3001/configs/${configId}`); // Replace with your actual API endpoint
          if (!response.ok) {
            this.exists = false;
          }
          const data = await response.json();
          this.form = {
            household_id: data.household_id || parseInt(configId),
            tank_height: data.tank_height,
            tank_capacity: data.tank_capacity,
            peak_usage_hours: data.peak_usage_hours,
            min_threshold_normal_hours: data.min_threshold_normal_hours,
            min_threshold_peak_hours: data.min_threshold_peak_hours,
            water_availability_hours: data.water_availability_hours,
          };
        } catch (error) {
          console.error('Error loading configuration:', error);
        }
      },
      async updateConfig() {
        try {
          const configId = this.$route.params.id;

          if (this.exists) {
              const response = await fetch(`http://localhost:3001/configs/${configId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.form),
              });
              if (response.ok) {
                alert('Configuration updated successfully!');
              } else {
                throw new Error('Failed to update configuration');
              }
          }
          else {
            console.log("NGGA");
            
            const response = await fetch(`http://localhost:3001/configs/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.form),
              });
              if (response.ok) {
                alert('Configuration updated successfully!');
              } else {
                throw new Error('Failed to update configuration');
              }
          }

        } catch (error) {
          console.error('Error updating configuration:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Additional styling for responsiveness or specific needs */
  </style>
  