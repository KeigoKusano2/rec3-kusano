<template>
  <v-container>
    
    <v-row justify="center">
      
      <v-col cols="12" md="6">
        
        <h2 class="text-h5 font-weight-bold text-center mb-4">
          商品一覧
        </h2>

        <v-list
          class="text-center d-flex flex-column align-center"
          two-line
          dense
        >
          <v-list-item
            v-for="item in products"
            :key="item.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.price }}円 / {{ item.quantity }}個
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small color="primary" @click="addToCart(item)">
                追加
              </v-btn>
            </v-list-item-action>

          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>
        <p class="text-subtitle-1 font-weight-bold text-center">
          合計金額：{{ totalPrice }}円
        </p>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // コンポーネント内で使用する算出プロパティ
  computed: {
    // VueXのstateから商品リストを取得する
    // 'product'はVueXストアのmodulesで定義した名前空間
    products() {
      return this.$store.state.product.products;
    },
    // VueXのgetterから合計金額を取得する
    // 'product/totalPrice'は名前空間付きのgetterへのアクセス
    totalPrice() {
      return this.$store.getters['product/totalPrice'];
    }
  },

  // コンポーネント内で使用するメソッド
  methods: {
    // 「追加」ボタンが押されたときに呼び出されるメソッド
    // VueXのmutation 'product/addToCart' をコミットして、カートに商品を追加する
    addToCart(product) {
      this.$store.commit('product/addToCart', product);
    }
  }
};
</script>
