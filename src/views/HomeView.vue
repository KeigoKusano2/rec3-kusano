<template>
  <v-container>
    <ProductList />
  </v-container>
</template>

<script>
import ProductList from '@/components/ProductList.vue'; // ProductListコンポーネントをインポート

export default {
  name: 'HomeView', // コンポーネント名

  // このビューで使用するコンポーネントを登録
  components: {
    ProductList,
  },
};
</script>
