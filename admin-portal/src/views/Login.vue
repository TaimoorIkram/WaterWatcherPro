<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card class="w-full max-w-md shadow-lg">
        <template #title>
          <div class="text-center pb-4">
            <h1 class="text-2xl font-bold text-slate-900">Water Watcher Pro</h1>
            <p class="mt-2 text-sm text-slate-600">Sign in to your account</p>
          </div>
        </template>
        
        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-6 p-4">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-slate-700">
                Email
              </label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                class="w-full"
                placeholder="Enter your email"
                required
              />
            </div>
  
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Password
                id="password"
                v-model="password"
                class="w-full"
                :feedback="false"
                placeholder="Enter your password"
                toggleMask
                required
              />
            </div>
  
            <div v-if="error" class="py-2">
              <Message severity="error" :closable="false" class="w-full">
                {{ error }}
              </Message>
            </div>
  
            <Button
              type="submit"
              label="Sign In"
              class="w-full p-button-lg"
              :loading="isLoading"
              :disabled="isLoading"
            />
  
            <div class="text-center text-sm text-slate-600">
              <router-link to="/forgot-password" class="text-blue-600 hover:text-blue-700">
                Forgot your password?
              </router-link>
            </div>
          </form>
        </template>
      </Card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user.store'
  import Button from 'primevue/button'
  import Card from 'primevue/card'
  import InputText from 'primevue/inputtext'
  import Password from 'primevue/password'
  import Message from 'primevue/message'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  const error = ref('')
  
  const handleLogin = async () => {
    if (!email.value || !password.value) return
    
    isLoading.value = true
    error.value = ''
    
    try {
      const { success, error: loginError, data } = await userStore.login(
        email.value, 
        password.value
      )
      
      if (success) {
        const role = userStore.userRole()
        if (role === 1) {
          router.push('/admin/user-analytics')
        } else if (role === 2) {
          router.push('/admin/user-analytics')
        } else {
          router.push('/login')
        }
      } else {
        error.value = loginError || 'Login failed. Please try again.'
      }
    } catch (err) {
      error.value = 'An unexpected error occurred. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  :deep(.p-password input) {
    width: 100%;
  }
  
  :deep(.p-card) {
    border-radius: 1rem;
  }
  
  :deep(.p-message) {
    border-radius: 0.5rem;
  }
  </style>