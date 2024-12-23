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
            <table v-if="!isLoading && technicians.length" class="min-w-full bg-white border">
              <thead>
                <tr>
                  <th class="px-4 py-2 border">Name</th>
                  <th class="px-4 py-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="technician in technicians" :key="technician.id">
                  <td class="px-4 py-2 border">{{ technician.name }}</td>
                  <td class="px-4 py-2 border">{{ technician.email }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="!isLoading && !technicians.length">No technicians found.</p>
  
            <!-- Create Technician Form -->
            <h3 class="text-lg font-semibold">Create New Technician</h3>
            <form @submit.prevent="createTechnician">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium">Name</label>
                <input type="text" v-model="newTechnician.name" placeholder="Enter name" required class="mt-1 block w-full"/>
              </div>
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium">Email</label>
                <input type="email" v-model="newTechnician.email" placeholder="Enter email" required class="mt-1 block w-full"/>
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium">Password</label>
                <input type="password" v-model="newTechnician.password" placeholder="Enter password" required class="mt-1 block w-full"/>
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
  import { useUserStore } from "@/stores/user.store"; // Import the user store
  import Card from "primevue/card";
  import Button from "primevue/button";
  
  // Configuring API URL
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const userStore = useUserStore(); // Initialize the user store
  
  // Loading and technicians state
  const isLoading = ref(false);
  const technicians = ref([]);
  
  // New technician data
  const newTechnician = ref({
    name: "",
    email: "",
    password: ""
  });
  
  // Fetch all technicians from the API
  const fetchTechnicians = async () => {
    try {
      isLoading.value = true;
  
      const token = userStore.getAccessToken(); // Get the token from the user store
  
      // Set up headers with the token
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      const response = await axios.get(`${API_URL}/users/technicians`, { headers }); // Include headers with the token
      technicians.value = response.data;
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
  
      const token = userStore.getAccessToken(); // Get the token from the user store
  
      // Set up headers with the token
      const headers = {
        Authorization: `Bearer ${token}`
      };
  
      const technicianData = {
        ...newTechnician.value,
        role_id: 4 // Set role_id to 4 for technicians
      };
  
      const response = await axios.post(`${API_URL}/users/technician`, technicianData, { headers }); // Include headers with the token
  
      technicians.value.push(response.data.user); // Add new technician to the list
      newTechnician.value = { name: "", email: "", password: "" }; // Reset form
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
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  </style>
  