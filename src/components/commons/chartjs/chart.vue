<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :styles="myStyles"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',

  components: { Bar },

  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    chartData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true
      }
    }
  },

  computed: {
    myStyles () {
      return {
        height: `${400}px`,
        width: `${400}px`,
        position: 'relative'
      }
    }
  }
}
</script>
