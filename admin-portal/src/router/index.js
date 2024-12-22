import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/Dashboard.vue';
import UserAnalyticsView from '@/views/UserAnalytics.vue';
import CommunityAnalyticsView from '@/views/CommunityAnalytics.vue'; // Add this line
import EditHouseholdConfig from '@/views/EditHouseholdConfig.vue';
import ListHouseholds from '@/views/ListHouseholds.vue';
import Login from '@/views/Login.vue';
import WaterLevels from '@/views/WaterLevels.vue';

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
      path: '/config',
      name: 'config',
      component: EditHouseholdConfig
    },
    {
      path: '/households/:user_id',
      name: 'households',
      component: ListHouseholds
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/levels',
      name: 'levels',
      component: WaterLevels
    },
  ]
});

// TODO: GUARD ROUTES
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
  
//   // Check if route requires auth
//   if (to.meta.requiresAuth && !userStore.isAuthenticated) {
//     next('/login')
//   } else if (to.path === '/login' && userStore.isAuthenticated) {
//     next('/dashboard')
//   } else {
//     next()
//   }
// })

export default router;
