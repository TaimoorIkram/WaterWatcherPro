<template>
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-semibold text-black mb-6">Households List</h1>
  
      <!-- Flex container for the table and form -->
      <div class="flex space-x-6">
        
        <!-- Table for displaying households -->
        <div class="flex-1">
          <table class="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">ID</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Location</th>
                <th class="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="household in households" :key="household.id">
                <td class="py-2 px-4 text-sm text-gray-800 border-b">{{ household.id }}</td>
                <td class="py-2 px-4 text-sm text-gray-800 border-b">{{ household.location }}</td>
                <td class="py-2 px-4 border-b">
                  <button
                    @click="goToConfigEdit(household.id)"
                    class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Edit Config
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Form for adding a new household -->
        <div class="w-80 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Add New Household</h2>
          <form @submit.prevent="addNewHousehold">
            <!-- Location -->
            <div class="space-y-4 mb-4">
              <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                v-model="newHousehold.location"
                class="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2"
                placeholder="Enter location"
                required
              />
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Add Household
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        households: [], // To store households list
        newHousehold: {
          location: '',
          user_id: '', // Will be set dynamically
        },
      };
    },
    created() {
      this.loadHouseholds();
      this.newHousehold.user_id = this.$route.params.user_id; // Set user_id from URL
    },
    methods: {
      // Fetch households list from the backend
      async loadHouseholds() {
        try {
          const userId = this.$route.params.user_id;
          const response = await fetch(`http://localhost:3001/households/user/${userId}`);
          const data = await response.json();
          this.households = data;
        } catch (error) {
          console.error('Error loading households:', error);
        }
      },
  
      // Navigate to the edit config page of the selected household
      goToConfigEdit(householdId) {
        this.$router.push(`/config/${householdId}`);
      },
  
      // Add a new household
      async addNewHousehold() {
        try {
          const response = await fetch('http://localhost:3001/households', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.newHousehold),
          });
          if (response.ok) {
            alert('New Household added successfully!');
            this.loadHouseholds(); // Refresh the list of households
            this.newHousehold.location = ''; // Clear the input
          } else {
            throw new Error('Failed to add new household');
          }
        } catch (error) {
          console.error('Error adding new household:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom styling for the table and button */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  button {
    background-color: #38a169; /* Tailwind's green color */
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2f855a; /* Darker shade of green */
  }
  
  input {
    width: 100%;
    border-radius: 4px;
    padding: 8px;
    border: 1px solid #ccc;
  }
  
  /* Adjust container and form layout */
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .flex {
    display: flex;
    justify-content: space-between;
  }
  
  .w-80 {
    width: 20rem; /* Adjust the width for the form */
  }
  
  .space-x-6 {
    gap: 1.5rem;
  }
  </style>
  