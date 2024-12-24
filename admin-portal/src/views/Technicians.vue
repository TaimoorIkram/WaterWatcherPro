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
          
          <DataTable 
            :value="technicians" 
            :loading="isLoading"
            stripedRows
            paginator 
            :rows="5" 
            :rowsPerPageOptions="[5,10,20]"
            responsiveLayout="scroll"
          >
            <Column field="name" header="Name" sortable>
              <template #body="slotProps">
                <div class="flex align-items-center">
                  <i class="pi pi-user mr-2"></i>
                  <span>{{ slotProps.data.name }}</span>
                </div>
              </template>
            </Column>
            <Column field="email" header="Email" sortable>
              <template #body="slotProps">
                <div class="flex align-items-center">
                  <i class="pi pi-envelope mr-2"></i>
                  <span>{{ slotProps.data.email }}</span>
                </div>
              </template>
            </Column>
          </DataTable>

          <!-- Create Technician Form -->
          <h3 class="text-lg font-semibold mt-6">Create New Technician</h3>
          <form @submit.prevent="createTechnician" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium">Name</label>
              <InputText 
                id="name"
                v-model="newTechnician.name" 
                placeholder="Enter name" 
                class="w-full mt-1"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <InputText 
                id="email"
                type="email" 
                v-model="newTechnician.email" 
                placeholder="Enter email" 
                class="w-full mt-1"
                required
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium">Password</label>
              <Password 
                id="password"
                v-model="newTechnician.password" 
                placeholder="Enter password" 
                class="w-full mt-1"
                :feedback="false"
                required
                toggleMask
              />
            </div>
            <Button 
              label="Create Technician" 
              icon="pi pi-plus" 
              type="submit" 
              :loading="isSubmitting"
              class="w-full mt-4"
            />
          </form>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/user.store";

// PrimeVue Components
import Card from "primevue/card";
import Button from "primevue/button";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const userStore = useUserStore();

const isLoading = ref(false);
const isSubmitting = ref(false);
const technicians = ref([]);

const newTechnician = ref({
  name: "",
  email: "",
  password: ""
});

const fetchTechnicians = async () => {
  try {
    isLoading.value = true;
    const token = userStore.getAccessToken();
    
    const response = await axios.get(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    technicians.value = response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
  } finally {
    isLoading.value = false;
  }
};

const createTechnician = async () => {
  try {
    isSubmitting.value = true;
    const token = userStore.getAccessToken();

    const technicianData = {
      ...newTechnician.value,
      role_id: 4
    };

    const response = await axios.post(
      `${API_URL}/users/technician`, 
      technicianData, 
      { headers: { Authorization: `Bearer ${token}` }}
    );

    technicians.value.push(response.data.user);
    newTechnician.value = { name: "", email: "", password: "" };
  } catch (error) {
    console.error("Error creating technician:", error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchTechnicians);
</script>

<style scoped>
.card {
  margin: 2rem;
}

:deep(.p-datatable) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.p-inputtext),
:deep(.p-password),
:deep(.p-button) {
  border-radius: 0.375rem;
}

:deep(.p-datatable-header) {
  background: #f8fafc;
}

:deep(.p-column-header-content) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>