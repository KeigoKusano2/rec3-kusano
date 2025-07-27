<template>
  <v-card class="pa-5">
    <v-card-title class="text-h6 text-center justify-center mb-3">
      週間予報
    </v-card-title>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">日付</th>
            <th class="text-left">天気</th>
            <th class="text-left">最低気温</th>
            <th class="text-left">最高気温</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(forecast, index) in weeklyForecasts" :key="index">
            <td>{{ forecast.date | formatShortDate }}</td>
            <td>{{ forecast.weatherTextDetailed }}</td>
            <td>{{ forecast.tempMin || '---' }}℃</td>
            <td>{{ forecast.tempMax || '---' }}℃</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: 'WeeklyForecastTable',
  props: {
    weeklyForecasts: {
      type: Array,
      required: true,
    },
  },
  filters: {
    formatShortDate(value) {
      if (!value) return '';
      const date = new Date(value);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return `${month}月${day}日(${dayOfWeek})`;
    },
  },
};
</script>
