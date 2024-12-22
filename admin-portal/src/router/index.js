import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/Dashboard.vue'
import UserAnalyticsView from '@/views/UserAnalytics.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: "/user-analytics", // The path for the page
      name: "userAnalytics",
      component: UserAnalyticsView, // The component to load
    },
  ]
})

export default router