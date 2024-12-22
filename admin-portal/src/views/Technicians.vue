<template>
    <div>
      <Card class="shadow-sm card">
        <template #title>
          <h2 class="text-xl font-semibold text-slate-800">Technicians</h2>
        </template>
        <template #content>
          <div class="p-4 flex flex-col gap-4">
            <!-- Technician List -->
            <h3 class="text-lg font-semibold">Existing Technicians</h3>
            <div v-if="isLoading" class="text-center">
              <i class="pi pi-spin pi-spinner text-blue-500 text-2xl"></i>
            </div>
            <ul v-if="!isLoading && technicians.length">
              <li v-for="technician in technicians" :key="technician.id">
                {{ technician.name }} ({{ technician.email }})
              </li>
            </ul>
            <p v-if="!isLoading && !technicians.length">No technicians found.</p>
  
            <!-- Create Technician Form -->
            <h3 class="text-lg font-semibold">Create New Technician</h3>
            <form @submit.prevent="createTechnician">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium">Name</label>
                <input type="text" v-model="newTechnician.name" required class="mt-1 block w-full"/>
              </div>
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium">Email</label>
                <input type="email" v-model="newTechnician.email" required class="mt-1 block w-full"/>
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium">Password</label>
                <input type="password" v-model="newTechnician.password" required class="mt-1 block w-full"/>
              </div>
              <div class="mb-4">
                <label for="role_id" class="block text-sm font-medium">Role ID</label>
                <input type="number" v-model="newTechnician.role_id" required class="mt-1 block w-full"/>
              </div>
              <Button label="Create Technician" icon="pi pi-plus" type="submit" />
            </form>
          </div>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import Card from "primevue/card";
  import Button from "primevue/button";
  
  // Configuring API URL
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  
  // Loading and technicians state
  const isLoading = ref(false);
  const technicians = ref([]);
  
  // New technician data
  const newTechnician = ref({
    name: "",
    email: "",
    password: "",
    role_id: 4 // Assuming 4 is the role ID for technicians
  });
  
  // Fetch all technicians from the API
  const fetchTechnicians = async () => {
    try {
      isLoading.value = true;
      const response = await axios.get(`${API_URL}/api/technicians`);
      technicians.value = response.data.technicians;
    } catch (error) {
      console.error("Error fetching technicians:", error);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Create a new technician
  const createTechnician = async () => {
    try {
      isLoading.value = true;
      const response = await axios.post(`${API_URL}/api/technicians`, newTechnician.value);
      technicians.value.push(response.data.technician); // Add new technician to the list
      newTechnician.value = { name: "", email: "", password: "", role_id: 4 }; // Reset form
    } catch (error) {
      console.error("Error creating technician:", error);
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(fetchTechnicians);
  </script>
  
  <style scoped>
  .card {
    margin: 2rem;
  }
  </style>
  