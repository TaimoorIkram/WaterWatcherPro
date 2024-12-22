import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/Dashboard.vue';
import UserAnalyticsView from '@/views/UserAnalytics.vue';
import CommunityAnalyticsView from '@/views/CommunityAnalytics.vue'; // Add this line
import EditHouseholdConfig from '@/views/EditHouseholdConfig.vue';
import ListHouseholds from '@/views/ListHouseholds.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/user-analytics',
      name: 'userAnalytics',
      component: UserAnalyticsView
    },
    {
      path: '/community-analytics', // Add this route
      name: 'communityAnalytics',
      component: CommunityAnalyticsView
    },
    {
      path: '/config/:id',
      name: 'config',
      component: EditHouseholdConfig
    },
    {
      path: '/households/:user_id',
      name: 'households',
      component: ListHouseholds
    },
  ]
});

export default router;
