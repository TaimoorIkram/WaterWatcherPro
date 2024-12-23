<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
      <!-- User Creation Form -->
      <form v-if="currentStep === 1" @submit.prevent="createUser" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Create User</h2>
        <p class="text-sm text-gray-600">
          Fill in the details to create a new user.
        </p>
  
        <div class="space-y-1">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            v-model="userForm.name"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter user's full name"
          />
        </div>
  
        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="userForm.email"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter user's email"
          />
        </div>
  
        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="userForm.password"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter a password"
          />
        </div>
  
        <div class="space-y-1">
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            v-model="userForm.roleId"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
          >
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
  
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create User
          </button>
        </div>
      </form>
  
      <!-- Household Configuration Form -->
      <form v-if="currentStep === 2" @submit.prevent="createHouseholdConfig" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Household Configuration</h2>
        <p class="text-sm text-gray-600">
          Configure the household details for the user.
        </p>
  
        <div class="space-y-1">
          <label for="sensor_id" class="block text-sm font-medium text-gray-700">Sensor ID</label>
          <input
            type="text"
            id="sensor_id"
            v-model="householdForm.sensor_id"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter sensor ID"
          />
        </div>
  
        <div class="space-y-1">
          <label for="actuator_id" class="block text-sm font-medium text-gray-700">Actuator ID</label>
          <input
            type="text"
            id="actuator_id"
            v-model="householdForm.actuator_id"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter actuator ID"
          />
        </div>
  
        <div class="space-y-1">
          <label for="tank_capacity" class="block text-sm font-medium text-gray-700">Tank Capacity</label>
          <input
            type="number"
            id="tank_capacity"
            v-model="householdForm.tank_capacity"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter tank capacity (in liters)"
          />
        </div>
  
        <div class="space-y-1">
          <label for="tank_height" class="block text-sm font-medium text-gray-700">Tank Height</label>
          <input
            type="number"
            id="tank_height"
            v-model="householdForm.tank_height"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            placeholder="Enter tank height (in meters)"
          />
        </div>
  
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-green-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Configure Household
          </button>
        </div>
      </form>
  
      <!-- Router Configuration Form -->
      <form v-if="currentStep === 3" @submit.prevent="updateRouterConfig" class="space-y-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Router Configuration</h2>
        <p class="text-sm text-gray-600">
          Configure the router details linked with the sensor.
        </p>
  
        <div class="space-y-1">
          <label for="sensor_id" class="block text-sm font-medium text-gray-700">Sensor ID</label>
          <input
            type="text"
            id="sensor_id"
            v-model="routerForm.sensor_id"
            class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            disabled
          />
        </div>
  
        <!-- Preferred Credentials Sections -->
        <div v-for="(credential, index) in credentials" :key="index" class="space-y-4">
          <h3 class="text-md font-medium text-gray-700">Preferred Credentials {{ index + 1 }}</h3>
          <div class="space-y-1">
            <label :for="'ssid' + index" class="block text-sm font-medium text-gray-700">SSID</label>
            <input
              type="text"
              :id="'ssid' + index"
              v-model="routerForm[`ssid${index + 1}`]"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <label :for="'password' + index" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              :id="'password' + index"
              v-model="routerForm[`password${index + 1}`]"
              class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 px-4 py-2"
            />
          </div>
        </div>
  
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
import { useUserStore } from "@/stores/user.store";

export default {
  data() {
    return {
      currentStep: 1, // Track the current form step
      userForm: {
        name: "",
        email: "",
        password: "",
        roleId: null,
      },
      householdForm: {
        sensor_id: "",
        actuator_id: "",
        tank_capacity: null,
        tank_height: null,
      },
      routerForm: {
        sensor_id: "",
        ssid1: "",
        password1: "",
        ssid2: "",
        password2: "",
      },
      roles: [], // Store role options
      credentials: [1, 2], // Dummy keys for credentials (you can extend this)
    };
  },
  created() {
    this.fetchRoles(); // Fetch role options on component creation
  },
  methods: {
    // Fetch roles from the API
    async fetchRoles() {
      const userStore = useUserStore();
      const token = userStore.getAccessToken();

      try {
        this.roles = [
            {
            "id": 1,
            "name": "super_admin"
            },
            {
            "id": 2,
            "name": "admin"
            },
            {
            "id": 3,
            "name": "customer"
            },
            {
            "id": 4,
            "name": "technician"
            }
        ];
      } catch (error) {
        console.error("Error fetching roles:", error);
        // Fallback roles if fetch fails
        this.roles = [
          { id: 1, name: "super_admin" },
          { id: 2, name: "admin" },
          { id: 3, name: "customer" },
          { id: 4, name: "technician" },
        ];
      }
    },

    // Handle User Creation
    async createUser() {
      const userStore = useUserStore();
      const token = userStore.getAccessToken();

      try {
        const response = await fetch("http://localhost:3001/users/customer/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.userForm),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const data = await response.json();
        console.log("User created:", data);
        this.householdForm.user_id = data.id; // Use created user's ID
        this.currentStep = 2; // Move to the next step
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },

    // Handle Household Configuration
    async createHouseholdConfig() {
      const userStore = useUserStore();
      const token = userStore.getAccessToken();

      try {
        const response = await fetch("http://localhost:3001/configs/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.householdForm),
        });

        if (!response.ok) {
          throw new Error("Failed to save household configuration");
        }

        const data = await response.json();
        console.log("Household configuration saved:", data);
        this.routerForm.sensor_id = this.householdForm.sensor_id; // Pass sensor ID to the router form
        this.currentStep = 3; // Move to the next step
      } catch (error) {
        console.error("Error saving household configuration:", error);
      }
    },

    // Handle Router Configuration Update
    async updateRouterConfig() {
      const userStore = useUserStore();
      const token = userStore.getAccessToken();

      try {
        const response = await fetch("http://localhost:3001/routers/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.routerForm),
        });

        if (!response.ok) {
          throw new Error("Failed to update router configuration");
        }

        const data = await response.json();
        console.log("Router configuration updated:", data);
        alert("Router configuration completed!");
        this.resetForms(); // Reset the forms after successful completion
      } catch (error) {
        console.error("Error updating router configuration:", error);
      }
    },

    // Reset all forms
    resetForms() {
      this.currentStep = 1;
      this.userForm = {
        name: "",
        email: "",
        password: "",
        roleId: null,
      };
      this.householdForm = {
        sensor_id: "",
        actuator_id: "",
        tank_capacity: null,
        tank_height: null,
      };
      this.routerForm = {
        sensor_id: "",
        ssid1: "",
        password1: "",
        ssid2: "",
        password2: "",
      };
    },
  },
};
</script>

