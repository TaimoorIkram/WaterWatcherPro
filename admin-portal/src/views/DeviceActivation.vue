<template>
  <div class="min-h-screen bg-slate-50 flex p-8">
    <!-- Form Card -->
    <Card class="w-full max-w-md shadow-lg mr-8">
      <template #title>
        <div class="text-center pb-4">
          <h1 class="text-2xl font-bold text-slate-900">Device Activation</h1>
          <p class="mt-2 text-sm text-slate-600">Register a new device</p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-6 p-4">
          <!-- Device ID -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Device ID
            </label>
            <InputText
              v-model="formData.deviceId"
              class="w-full"
              placeholder="Enter device ID"
            />
          </div>
 
          <!-- Secret -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Secret
            </label>
            <InputNumber
              v-model="formData.secret"
              class="w-full"
              placeholder="Enter secret number"
              :useGrouping="false"
            />
          </div>
 
          <!-- Type -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Device Type
            </label>
            <Dropdown
              v-model="formData.type"
              :options="deviceTypes"
              class="w-full"
              placeholder="Select device type"
            />
          </div>
 
          <!-- Error Message -->
          <div v-if="error" class="py-2">
            <Message severity="error" :closable="false" class="w-full">
              {{ error }}
            </Message>
          </div>
 
          <!-- Submit Button -->
          <Button
            type="submit"
            label="Activate Device"
            class="w-full p-button-lg"
            :loading="isLoading"
          />
        </form>
      </template>
    </Card>
 
    <!-- Requests Table Card -->
    <Card class="flex-1 shadow-lg">
      <template #title>
        <div class="pb-4">
          <h2 class="text-xl font-bold text-slate-900">Device Requests</h2>
          <p class="mt-2 text-sm text-slate-600">All device activation requests</p>
        </div>
      </template>
      
      <template #content>
        <DataTable 
          :value="requests" 
          class="p-4"
          :paginator="true" 
          :rows="5"
          stripedRows
          responsiveLayout="scroll"
        >
          <Column field="deviceId" header="Device ID" sortable />
          <Column field="type" header="Type" sortable>
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.type === 'SENSOR' ? 'info' : 'warning'"
                :value="slotProps.data.type"
              />
            </template>
          </Column>
          <Column field="secret" header="Secret" sortable />
          <Column field="nonce" header="Nonce" sortable />
          <Column field="activated" header="Status" sortable>
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.activated ? 'success' : 'danger'"
                :value="slotProps.data.activated ? 'Activated' : 'Pending'"
              />
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button 
                icon="pi pi-key" 
                class="p-button-rounded p-button-success mr-2"
                @click="showVerificationDialog(slotProps.data)"
                :disabled="slotProps.data.activated"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
 
    <!-- Verification Dialog -->
    <Dialog 
      v-model:visible="verificationDialog" 
      header="Verify Device" 
      :style="{width: '450px'}"
      modal
    >
      <div class="space-y-4 p-4">
        <div class="text-sm text-slate-600">
          Enter verification key for Device ID: {{ selectedDevice?.deviceId }}
        </div>
        <InputText v-model="verificationKey" class="w-full" placeholder="Enter verification key" />
        <div v-if="verificationError" class="text-red-500 text-sm">
          {{ verificationError }}
        </div>
      </div>
      <template #footer>
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          @click="verificationDialog = false" 
          class="p-button-text"
        />
        <Button 
          label="Verify" 
          icon="pi pi-check" 
          @click="verifyDevice" 
          :loading="verifyLoading"
        />
      </template>
    </Dialog>
  </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue'
 import Card from 'primevue/card'
 import InputText from 'primevue/inputtext'
 import InputNumber from 'primevue/inputnumber'
 import Dropdown from 'primevue/dropdown'
 import Button from 'primevue/button'
 import Message from 'primevue/message'
 import DataTable from 'primevue/datatable'
 import Column from 'primevue/column'
 import Tag from 'primevue/tag'
 import Dialog from 'primevue/dialog'
 import axios from 'axios'
 
 const formData = ref({
  deviceId: '',
  secret: null,
  type: null
 })
 
 const deviceTypes = ref([
  'SENSOR',
  'ACTUATOR'
 ])
 
 const isLoading = ref(false)
 const error = ref('')
 const requests = ref([])
 const verificationDialog = ref(false)
 const selectedDevice = ref(null)
 const verificationKey = ref('')
 const verificationError = ref('')
 const verifyLoading = ref(false)
 
 const fetchRequests = async () => {
  try {
    const response = await axios.get('http://localhost:3001/requests')
    requests.value = response.data
  } catch (err) {
    console.error('Failed to fetch requests:', err)
  }
 }
 
 const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''
 
    await axios.post('http://localhost:3001/requests/activate-device', {
      deviceId: formData.value.deviceId,
      secret: formData.value.secret,
      type: formData.value.type
    })
 
    await fetchRequests()
    formData.value = { deviceId: '', secret: null, type: null }
    
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to activate device'
  } finally {
    isLoading.value = false
  }
 }
 
 const showVerificationDialog = (device) => {
  selectedDevice.value = device
  verificationDialog.value = true
  verificationKey.value = ''
  verificationError.value = ''
 }
 
 const verifyDevice = async () => {
  if (!verificationKey.value) {
    verificationError.value = 'Please enter verification key'
    return
  }
 
  try {
    verifyLoading.value = true
    verificationError.value = ''
 
    await axios.post('http://localhost:3001/requests/verify', {
      deviceId: selectedDevice.value.deviceId,
      key: verificationKey.value
    })
 
    await fetchRequests()
    verificationDialog.value = false
  } catch (err) {
    verificationError.value = err.response?.data?.error || 'Verification failed'
  } finally {
    verifyLoading.value = false
  }
 }
 
 onMounted(() => {
  fetchRequests()
 })
 </script>
 
 <style scoped>
 :deep(.p-inputnumber-input),
 :deep(.p-dropdown),
 :deep(.p-card) {
  width: 100%;
 }
 
 :deep(.p-card) {
  border-radius: 1rem;
 }
 
 :deep(.p-message) {
  border-radius: 0.5rem;
 }
 </style>