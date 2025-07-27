// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue'
import PurchaseView from '../views/PurchaseView.vue'; // 購入ページの読み込み
import WeatherView from '../views/WeatherView.vue'; // WeatherViewのみインポート

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  
  // 購入ページのルートを追加
  {
    path: '/purchase',
    name: 'purchase',
    component: PurchaseView
  },
  {
    path: '/weather', // 天気予報ページのパス
    name: 'weather',
    component: WeatherView
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;