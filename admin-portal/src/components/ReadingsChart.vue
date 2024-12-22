<!-- components/ReadingsChart.vue -->
<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" v-if="chartType === 'line'" />
    <Bar :data="chartData" :options="chartOptions" v-if="chartType === 'bar'" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  readings: {
    type: Object,
    required: true
  },
  chartType: {
    type: String,
    default: 'line'
  },
  xLabel: {
    type: String,
    default: 'X Axis'
  },
  yLabel: {
    type: String,
    default: 'Y Axis'
  }
});

const chartData = computed(() => ({
  labels: props.readings.labels || [],
  datasets: props.readings.datasets || []
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750, // Smooth animation for updates
  },
  plugins: {
    legend: {
      display: true
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
      },
      title: {
        display: true,
        text: props.xLabel
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      title: {
        display: true,
        text: props.yLabel
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}));

watch(() => props.readings, () => {
  chartData.value = {
    labels: props.readings.labels || [],
    datasets: props.readings.datasets || []
  };
}, { deep: true });
</script>

<style scoped>
.chart-container {
  height: 400px; /* Adjust the height as needed */
  width: 100%;
}

canvas {
  display: block;
  height: 100% !important;
  width: 100% !important;
}
</style>
