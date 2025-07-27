<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h2 class="text-h5 font-weight-bold text-center mb-4">天気予報</h2>

        <v-select
          v-model="selectedArea"
          :items="availableAreas"
          label="都道府県を選択"
          item-text="text"
          item-value="value"
          outlined
          dense
          class="mb-4"
          @change="onAreaChange"
        ></v-select>

        <v-card v-if="loading" class="pa-5 text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-3">天気情報を取得中...</p>
        </v-card>

        <v-alert v-else-if="error" type="error" class="mt-4">
          {{ error }}
          <v-btn small color="error" class="ml-3" @click="fetchSelectedWeather">再試行</v-btn>
        </v-alert>

        <div v-else-if="hasOverview">
          <WeatherSummary
            :area-name="selectedAreaName"
            :report-datetime="reportDatetime"
            :today-weather="todayOverallWeather"
            :overview-text="overviewForecast.text"
          />

          <v-divider class="my-4"></v-divider>

          <WeeklyForecastTable :weekly-forecasts="weeklyForecasts" />

          <p class="mt-4 text-caption">※気象庁APIのデータに基づいています。</p>
        </div>

        <v-card v-else class="pa-5 text-center">
          <p>天気情報がありません。<br>都道府県を選択するか、「天気情報を取得」ボタンを押してください。</p>
          <v-btn color="primary" @click="fetchSelectedWeather">天気情報を取得</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
// 新しく作成したコンポーネントをインポート
import WeatherSummary from '@/components/WeatherSummary.vue';
import WeeklyForecastTable from '@/components/WeeklyForecastTable.vue';

export default {
  name: 'WeatherView',
  components: {
    WeatherSummary,       // コンポーネントを登録
    WeeklyForecastTable,  // コンポーネントを登録
  },
  
  data() {
    return {
      // selectedArea は VueX の selectedAreaCode と同期させるため、
      // ここでは直接定義せず、computed の setter/getter で扱う
    };
  },

  computed: {
    ...mapState('weather', [
      'overviewForecast',
      'detailedForecast',
      'loading',
      'error',
      'selectedAreaCode',
      'areas', // state.areas もここでマッピング
      'centers', // centers もマッピングに追加
    ]),
    ...mapGetters('weather', [
      'hasOverview',
      'hasDetailed',
      'todayOverallWeather', 
      'reportDatetime',
      'weeklyForecasts',
      'availableAreas',
    ]),
    
    selectedArea: {
      get() {
        return this.selectedAreaCode;
      },
      set(value) {
        this.setSelectedAreaCode(value);
      }
    },
    
    selectedAreaName() {
        // area.json の offices に selectedAreaCode が存在すればその名前を返す
        if (this.areas[this.selectedAreaCode]) {
            return this.areas[this.selectedAreaCode].name;
        }
        // それでも見つからない場合（例えば、010000などの直接 offices にないコードの場合）
        // Centers からも探す、またはデフォルト名を返す
        if (this.centers[this.selectedAreaCode]) {
            return this.centers[this.selectedAreaCode].name;
        }
        return '選択されていません';
    }
  },

  created() {
    // コンポーネント作成時にエリアデータをフェッチ
    this.fetchAreas();
    // 初期選択エリアの天気情報をフェッチ
    this.fetchSelectedWeather();
  },

  methods: {
    ...mapActions('weather', [
      'fetchWeather',
      'fetchAreas',
    ]),
    ...mapMutations('weather', [
        'setSelectedAreaCode',
    ]),
    
    onAreaChange(newAreaCode) {
      // ドロップダウン選択時に天気情報を更新
      this.fetchWeather(newAreaCode);
    },

    fetchSelectedWeather() {
      // ボタンクリック時や初期ロード時に天気情報をフェッチ
      this.fetchWeather(this.selectedAreaCode);
    }
  },
};
</script>
