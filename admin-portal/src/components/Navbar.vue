<template>
    <nav class="navbar">
      <ul>
        <!-- <li><router-link to="/admin/dashboard">Dashboard</router-link></li> -->
        <li><router-link to="/admin/user-analytics">User Analytics</router-link></li>
        <li><router-link to="/admin/community-analytics">Community Analytics</router-link></li>
        <li><router-link to="/admin/technicians">Technicians</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    padding: 1rem;
  }
  
  .navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 2rem;
  }
  
  .navbar li {
    display: inline;
  }
  
  .navbar a {
    color: white;
    text-decoration: none;
  }
  
  .navbar a:hover {
    text-decoration: underline;
  }
  </style>
  