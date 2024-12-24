import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user.store'; // Import user store

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Rehydrate the store from localStorage
const userStore = useUserStore();
userStore.initializeStore();

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);

app.mount('#app');
