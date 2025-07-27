// src/store/modules/weather.js

export default {
  namespaced: true,

  state: {
    overviewForecast: null,
    detailedForecast: null,
    loading: false,
    error: null,
    areas: {}, // areasはオブジェクトとして保持（lookupしやすいように）
    selectedAreaCode: '130000', // 初期値は東京
  },

  getters: {
    hasOverview: (state) => !!state.overviewForecast,
    hasDetailed: (state) => !!state.detailedForecast,

    // 今日の総合的な天気を取得
    todayOverallWeather(state) {
      // 選択された都道府県コード（例: 130000）に対応する主要なエリア（例: 130010 東京地方）を特定する
      const selectedOfficeChildren = state.areas[state.selectedAreaCode]?.children;
      let targetAreaCodeForTodayWeather = state.selectedAreaCode; // デフォルトは都道府県コード

      // detailedForecast[0].timeSeries[0]のareasには、都道府県コードの子エリアがあることが多い
      // 例: 東京都(130000) -> 東京地方(130010)
      if (selectedOfficeChildren && selectedOfficeChildren.length > 0) {
        // 通常、最初の子エリアがその都道府県の主要な地方区分となる
        targetAreaCodeForTodayWeather = selectedOfficeChildren[0];
      }

      const dailyWeatherTimeSeries = state.detailedForecast?.[0]?.timeSeries?.[0];

      if (!dailyWeatherTimeSeries || !dailyWeatherTimeSeries.areas || dailyWeatherTimeSeries.areas.length === 0) {
        return '---';
      }

      // targetAreaCodeForTodayWeatherに一致するareasを探す
      // または、areasの最初の要素を使う（多くの場合はその都道府県の代表的な地域）
      const areaData = dailyWeatherTimeSeries.areas.find(area =>
          area.area.code === targetAreaCodeForTodayWeather || (area.area.code === state.selectedAreaCode)
      );

      if (areaData && areaData.weathers && areaData.weathers.length > 0) {
        return areaData.weathers[0];
      }
      return '---';
    },

    reportDatetime: (state) => state.overviewForecast ? state.overviewForecast.reportDatetime : '---',

    weeklyForecasts(state, getters) {
      // 週間天気予報のデータ (weatherCodes, pops, reliabilities)
      // detailedForecast[1].timeSeries[0] にある
      const weeklyWeatherTimeSeries = state.detailedForecast?.[1]?.timeSeries?.[0];
      // 週間気温予報のデータ (tempsMin, tempsMax)
      // detailedForecast[1].timeSeries[1] にある
      const weeklyTempTimeSeries = state.detailedForecast?.[1]?.timeSeries?.[1];

      // --- 週間天気データのエリアを特定 ---
      let weatherArea = null;
      // まず、selectedAreaCode (例: 140000 神奈川県) と完全に一致するエリアを探す
      weatherArea = weeklyWeatherTimeSeries.areas.find(area => area.area.code === state.selectedAreaCode);
      
      if (!weatherArea) {
        // 一致するものがなければ、selectedAreaCodeの子エリアの中から、
        // weeklyWeatherTimeSeries.areas に含まれるもの（最初のもの）を探す
        const selectedOfficeChildren = state.areas[state.selectedAreaCode]?.children;
        if (selectedOfficeChildren && selectedOfficeChildren.length > 0) {
            for (const childCode of selectedOfficeChildren) {
                weatherArea = weeklyWeatherTimeSeries.areas.find(area => area.area.code === childCode);
                if (weatherArea) break; // 見つかったらループを抜ける
            }
        }
      }

      // それでも見つからなければ、最も代表的なエリア（通常はareas[0]）を使用
      if (!weatherArea) {
          weatherArea = weeklyWeatherTimeSeries.areas[0];
      }

      if (!weatherArea) {
          // console.log('週間天気データが見つかりません。');
          return [];
      }

      // --- 週間気温データのエリアを特定 ---
      let tempArea = null;
      
      const selectedAreaName = state.areas[state.selectedAreaCode]?.name;
      if (selectedAreaName) {
          tempArea = weeklyTempTimeSeries.areas.find(area => area.area.name === selectedAreaName);
      }     
      // それでも見つからなければ、最初の地点を使用（最も代表的な地点であることが多い）
      if (!tempArea) {
          tempArea = weeklyTempTimeSeries.areas[0];
      }
      if (!tempArea) {
          // console.log('週間気温データが見つかりません。');
          return [];
      }
      
      const forecasts = [];
      const timeDefines = weeklyWeatherTimeSeries.timeDefines;

      for (let i = 0; i < timeDefines.length; i++) {
        const date = timeDefines[i];
        const weatherCode = weatherArea.weatherCodes?.[i];
        
        let weatherTextDetailed = '';
        if (weatherCode) {
            weatherTextDetailed = getters.getWeatherDescription(weatherCode);
        }
        const pop = weatherArea.pops?.[i];
        if (pop && pop !== "") {
            weatherTextDetailed += (weatherTextDetailed ? ' ' : '') + `降水確率: ${pop}%`;
        }

        // 気温データは tempsMin/Max が存在し、対応するインデックスがあれば取得
        const tempMin = tempArea.tempsMin?.[i];
        const tempMax = tempArea.tempsMax?.[i];

        forecasts.push({
          date: date,
          weatherCode: weatherCode,
          weatherTextDetailed: weatherTextDetailed,
          tempMin: tempMin,
          tempMax: tempMax,
        });
      }
      return forecasts;
    },

    getWeatherDescription: () => (code) => {
      if (!code) return '不明';
      const codeStr = String(code);
      if (codeStr.startsWith('1')) return '晴れ';
      if (codeStr.startsWith('2')) return 'くもり';
      if (codeStr.startsWith('3')) return '雨';
      if (codeStr.startsWith('4')) return '雪';
      return 'その他';
    },

    availableAreas(state) {
        const allOffices = [];
        // state.areas はオブジェクトなので for...in で回す
        for (const code in state.areas) {
            const area = state.areas[code];
            // 天気予報APIで利用可能な主要な地域（都道府県レベルまたはそれに準ずる地域）をフィルタリング
            // codeが6桁で、かつ nameプロパティを持つものをリストアップ
            // （ここでは厳密な「都道府県」であるかのチェックはせず、area.jsonのofficesにあるものを全て対象にする）
            if (area.name && code.length === 6) {
                allOffices.push({
                    text: area.name,
                    value: code
                });
            }
        }
        return allOffices;
        //return allOffices.sort((a, b) => a.text.localeCompare(b.text, 'ja'));//あいうえお順並び替え
    },
  },

  mutations: {
    // ... 変更なし ...
    setOverviewForecast(state, data) {
      state.overviewForecast = data;
    },
    setDetailedForecast(state, data) {
      state.detailedForecast = data;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, message) {
      state.error = message;
    },
    clearWeather(state) {
      state.overviewForecast = null;
      state.detailedForecast = null;
      state.error = null;
    },
    setAreas(state, areas) {
      state.areas = areas; // areasをオブジェクトとしてそのまま保存
    },
    setSelectedAreaCode(state, code) {
        state.selectedAreaCode = code;
    }
  },

  actions: {
    async fetchWeather({ commit, state }, areaCode = null) {
      commit('setLoading', true);
      commit('setError', null);
      commit('clearWeather');

      const currentAreaCode = areaCode || state.selectedAreaCode;

      try {
        const overviewResponse = await fetch(`https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${currentAreaCode}.json
`);
        if (!overviewResponse.ok) {
          throw new Error(`天気概要の取得に失敗しました: ${overviewResponse.status}`);
        }
        const overviewData = await overviewResponse.json();
        commit('setOverviewForecast', overviewData);

        const detailedResponse = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${currentAreaCode}.json`);
        if (!detailedResponse.ok) {
          throw new Error(`天気詳細の取得に失敗しました: ${detailedResponse.status}`);
        }
        const detailedData = await detailedResponse.json();
        commit('setDetailedForecast', detailedData);

      } catch (error) {
        console.error('天気予報の取得エラー:', error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
             commit('setError', '天気予報の取得に失敗しました。CORSエラーの可能性があります。気象庁のAPIは、ブラウザからの直接アクセスが制限されている場合があります。');
        } else {
             if (error.message.includes('ステータス')) {
                 commit('setError', `天気予報の取得中にAPIエラーが発生しました: ${error.message}`);
             } else {
                 commit('setError', `天気予報の取得中に不明なエラーが発生しました: ${error.message}`);
             }
        }
      } finally {
        commit('setLoading', false);
      }
    },

    async fetchAreas({ commit }) {
      try {
        const response = await fetch('https://www.jma.go.jp/bosai/common/const/area.json');
        if (!response.ok) {
          throw new Error(`エリアリストの取得に失敗しました: ${response.status}`);
        }
        const data = await response.json();
        // officesをオブジェクトとしてそのままstateに保存
        commit('setAreas', data.offices);
      } catch (error) {
        console.error('エリアデータの取得エラー:', error);
      }
    }
  }
};