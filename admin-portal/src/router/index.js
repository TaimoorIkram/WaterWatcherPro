import { createRouter, createWebHistory } from 'vue-router';
// import DashboardView from '@/views/Dashboard.vue';
import UserAnalyticsView from '@/views/UserAnalytics.vue';
import CommunityAnalyticsView from '@/views/CommunityAnalytics.vue';
import EditHouseholdConfig from '@/views/EditHouseholdConfig.vue';
import ListHouseholds from '@/views/ListHouseholds.vue';
import Login from '@/views/Login.vue';
import TechniciansView from '@/views/Technicians.vue';
import { useUserStore } from '@/stores/user.store'; // Import user store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/admin/dashboard',
    //   name: 'dashboard',
    //   component: DashboardView,
    //   meta: { requiresAuth: true, requiredRole: 2 }
    // },
    {
      path: '/admin/user-analytics',
      name: 'userAnalytics',
      component: UserAnalyticsView,
      meta: { requiresAuth: true, requiredRole: 2 }
    },
    {
      path: '/admin/community-analytics',
      name: 'communityAnalytics',
      component: CommunityAnalyticsView,
      meta: { requiresAuth: true, requiredRole: 2 }
    },
    {
      path: '/admin/technicians',
      name: 'technicians',
      component: TechniciansView,
      meta: { requiresAuth: true, requiredRole: 2 }
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
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
});

// Route guard for authentication and authorization
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isAuthenticated()) {
      next({ name: 'login' });
    } else if (to.matched.some(record => record.meta.requiredRole)) {
      const requiredRole = to.meta.requiredRole;
      const userRole = userStore.userRole();
      if (userRole === requiredRole) {
        next();
      } else {
        next({ name: 'login' }); // Redirect to login if the user does not have the required role
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
