<template>
  <v-container>
    
    <v-row justify="center">
      
      <v-col cols="12" md="6" class="text-center">
        
        <h2 class="text-h5 font-weight-bold mb-4">購入ページ</h2>

        <p class="text-subtitle-1 mb-2">カートに入っている商品一覧：</p>

        <v-list dense class="mb-4">
          <v-list-item
            v-for="item in productsInCart"
            :key="item.id"
          >
            <v-list-item-content class="text-center">
              <v-list-item-title>
                {{ item.name }} - {{ item.quantity }}個
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>
        <p class="text-subtitle-1 font-weight-bold mb-4">
          合計金額：{{ totalPrice }}円
        </p>

        <v-btn
          color="success"
          @click="purchase"
          :loading="loading"
          :disabled="loading || productsInCart.length === 0"
        >
          購入する
        </v-btn>

        <v-alert
          v-if="showPopup"
          type="success"
          class="mt-6"
          border="left"
          colored-border
          elevation="2"
        >
          購入が完了しました！
        </v-alert>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  // コンポーネントのローカルなデータを定義
  data() {
    return {
      loading: false,  // 購入処理中かどうかを示すフラグ
      showPopup: false // 購入完了ポップアップを表示するかどうかのフラグ
    };
  },
  // コンポーネント内で使用する算出プロパティ
  computed: {
    // カートに入っている商品（数量が1以上の商品）をVueXのstateからフィルタリングして返す
    productsInCart() {
      // productモジュールのstate.productsにアクセスし、フィルタリング
      return this.$store.state.product.products.filter(p => p.quantity > 0);
    },
    // カートの合計金額をVueXのgetterから取得する
    totalPrice() {
      // productモジュールのtotalPrice getterにアクセス
      return this.$store.getters['product/totalPrice'];
    }
  },
  // コンポーネント内で使用するメソッド
  methods: {
    // 購入ボタンが押されたときに呼び出される非同期メソッド
    async purchase() {
      this.loading = true; // ローディング状態を開始

      // VueXのaction 'product/purchaseItems' をディスパッチして購入処理を実行
      // async/await を使用して非同期処理の完了を待つ
      await this.$store.dispatch('product/purchaseItems');

      this.loading = false; // ローディング状態を終了
      this.showPopup = true; // 購入完了ポップアップを表示

      // 2秒後にポップアップを非表示にする
      setTimeout(() => {
        this.showPopup = false;
      }, 2000);
    }
  }
};
</script>
