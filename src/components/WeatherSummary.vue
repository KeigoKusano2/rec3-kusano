<template>
  <v-card class="pa-5 mb-4 text-center">
    <v-card-title class="text-h6 text-center justify-center">
      {{ areaName }}の今日の天気
    </v-card-title>
    <v-card-subtitle class="text-center">
      発表: {{ reportDatetime | formatDate }}
    </v-card-subtitle>
    <v-card-text>
      <p class="text-h4 font-weight-bold">{{ todayWeather }}</p>
      <h3 class="text-h6 mb-3">天気概況</h3>
      <v-card-text class="text-left text-body-1 py-0">
          <pre style="white-space: pre-wrap; font-family: inherit;">{{ overviewText }}</pre>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WeatherSummary',
  props: {
    areaName: {
      type: String,
      required: true,
    },
    reportDatetime: {
      type: String,
      required: true,
    },
    todayWeather: {
      type: String,
      required: true,
    },
    overviewText: {
      type: String,
      default: '',
    },
  },
  filters: {
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },
  },
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
}
</style>