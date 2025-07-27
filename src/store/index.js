// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import product from './modules/product' // 商品管理モジュールをインポート
import weather from './modules/weather'; // weatherモジュールのみインポート

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    product ,// productモジュールを登録
    weather // weatherモジュールを登録
  }
});