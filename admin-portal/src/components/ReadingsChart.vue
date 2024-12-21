<!-- components/ReadingsChart.vue -->
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed, watch } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  readings: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => ({
  labels: props.readings.map(r => new Date(r.timestamp).toLocaleTimeString()),
  datasets: [{
    label: 'Water Level',
    data: props.readings.map(r => r.waterLevel),
    borderColor: 'rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 2,
    pointHoverRadius: 5
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750, // Smooth animation for updates
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

// Force chart update when data changes
watch(() => props.readings, () => {
  chartData.value = {
    ...chartData.value,
    labels: props.readings.map(r => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [{
      ...chartData.value.datasets[0],
      data: props.readings.map(r => r.waterLevel)
    }]
  };
}, { deep: true });
</script>