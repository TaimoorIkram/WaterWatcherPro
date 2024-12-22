<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style>
/* Add any global styles if needed */

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #f8fafc;
}

#app {
  min-height: 100vh;
}
</style>