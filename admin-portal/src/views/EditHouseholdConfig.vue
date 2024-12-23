<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Household Configuration</h2>
      <form @submit.prevent="updateConfig" class="space-y-6">
        <!-- Household ID -->

        <div class="space-y-1">
          <label for="sensor_id" class="block text-sm font-medium text-gray-700">Sensor ID</label>
          <input
            type="number"
            id="sensor_id"
            v-model="form.sensor_id"
            disabled
            class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter sensor id"
          />
        </div>

        <div class="space-y-1">
          <label for="actuator_id" class="block text-sm font-medium text-gray-700">Actuator ID</label>
          <input
            type="number"
            id="actuator_id"
            v-model="form.actuator_id"
            disabled
            class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter actuator id"
          />
        </div>

        <!-- Tank Height -->
        <div class="space-y-1">
          <label for="tank_height" class="block text-sm font-medium text-gray-700">Tank Height</label>
          <input
            type="number"
            id="tank_height"
            v-model="form.tank_height"
            disabled
            class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
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
            disabled
            class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
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

        <div class="space-y-1">
          <label for="max_threshold_normal_hours" class="block text-sm font-medium text-gray-700">Max Threshold Normal Hours</label>
          <input
            type="number"
            id="max_threshold_normal_hours"
            v-model="form.max_threshold_normal_hours"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter minimum threshold of water level during normal hours"
          />
        </div>

        <div class="space-y-1">
          <label for="max_threshold_peak_hours" class="block text-sm font-medium text-gray-700">Max Threshold Peak Hours</label>
          <input
            type="number"
            id="max_threshold_peak_hours"
            v-model="form.max_threshold_peak_hours"
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

      <form @submit.prevent="updateRouterConfig" class="space-y-6">
        <!-- Short Description -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Router Configuration</h2>
        <p class="text-sm text-gray-600">
          Configure the router details linked with a specific sensor. Ensure you provide valid SSID and password pairs for each configuration.
        </p>

        <!-- Sensor ID -->
        <div class="space-y-1">
          <label for="sensor_id" class="block text-sm font-medium text-gray-700">Sensor ID</label>
          <input
            type="text"
            id="sensor_id"
            v-model="routerForm.sensor_id"
            disabled
            class="w-full bg-gray-200 text-gray-500 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter sensor ID"
          />
        </div>

        <!-- Preferred Credentials 1 -->
        <div class="space-y-4">
          <h3 class="text-md font-medium text-gray-700">Preferred Credentials 1</h3>
          <div class="space-y-1">
            <label for="ssid1" class="block text-sm font-medium text-gray-700">SSID 1</label>
            <input
              type="text"
              id="ssid1"
              v-model="routerForm.ssid1"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter SSID 1"
            />
          </div>
          <div class="space-y-1">
            <label for="password1" class="block text-sm font-medium text-gray-700">Password 1</label>
            <input
              type="password"
              id="password1"
              v-model="routerForm.password1"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter password for SSID 1"
            />
          </div>
        </div>

        <!-- Preferred Credentials 2 -->
        <div class="space-y-4">
          <h3 class="text-md font-medium text-gray-700">Preferred Credentials 2</h3>
          <div class="space-y-1">
            <label for="ssid2" class="block text-sm font-medium text-gray-700">SSID 2</label>
            <input
              type="text"
              id="ssid2"
              v-model="routerForm.ssid2"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter SSID 2"
            />
          </div>
          <div class="space-y-1">
            <label for="password2" class="block text-sm font-medium text-gray-700">Password 2</label>
            <input
              type="password"
              id="password2"
              v-model="routerForm.password2"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
              placeholder="Enter password for SSID 2"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Update Router Configuration
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.store';

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
      routerForm: {
        sensor_id: "",
        ssid1: "",
        password1: "",
        ssid2: "",
        password2: "",
      },
      exists: true,
    };
  },
  mounted() {
    this.loadConfig();
  },
  methods: {
    async updateRouterConfig() {
      try {
        const response = await fetch(`http://localhost:3001/routerconfigs/${this.form.sensor_id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${useUserStore().getAccessToken()}`
          },
          body: JSON.stringify(this.routerForm),
        });

        if (!response.ok) throw new Error("Failed to update router configuration.");
        alert("Router configuration updated successfully!");
      } catch (error) {
        console.error("Error updating router configuration:", error);
        alert("Failed to update configuration. Please try again.");
      }
    },
    async loadConfig() {
      try {
        const configId = this.$route.params.id;
        console.log(useUserStore().getAccessToken());
        
        
        const response = await fetch(`http://localhost:3001/configs/my`, {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${useUserStore().getAccessToken()}`
          },
        }); // Replace with your actual API endpoint
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
          max_threshold_normal_hours: data.max_threshold_normal_hours,
          max_threshold_peak_hours: data.max_threshold_peak_hours,
          water_availability_hours: data.water_availability_hours,
          sensor_id: data.sensor_id,
          actuator_id: data.actuator_id,
        };

        this.form.sensor_id = data.sensor_id;
        if (!response.ok) throw new Error("Failed to update router configuration.");

        const routerResponse = await fetch(`http://localhost:3001/routerconfigs/${this.form.sensor_id}`, {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${useUserStore().getAccessToken()}`
          },
        });

        if (routerResponse.ok) {
          const data = await routerResponse.json(); // Await the JSON response
          // Map the response attributes to the form
          this.routerForm.sensor_id = data.sensor_id;
          this.routerForm.ssid1 = data.ssid1;
          this.routerForm.password1 = data.password1;
          this.routerForm.ssid2 = data.ssid2;
          this.routerForm.password2 = data.password2;

          // Optionally display a success message
          console.log("Router configuration saved successfully:", data);
        } else {
          // Handle errors
          console.error("Failed to save router configuration:", await routerResponse.text());
        }
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
                "Content-Type": "application/json",
                "Authorization": `Bearer ${useUserStore().getAccessToken()}`
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
          const response = await fetch(`http://localhost:3001/configs/`, {
              method: 'POST',
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${useUserStore().getAccessToken()}`
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
