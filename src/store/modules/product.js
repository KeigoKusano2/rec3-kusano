export default {
  namespaced: true, // このモジュールを名前空間付きにする (例: product/addToCart)

  // 1. State: アプリケーション全体のデータを保持
  state: {
    products: [
      { id: 1, name: 'リンゴ', price: 150, quantity: 0 },
      { id: 2, name: 'バナナ', price: 120, quantity: 0 },
      { id: 3, name: 'みかん', price: 100, quantity: 0 }
    ]
  },

  // 2. Getters: Stateから派生したデータを取得 (計算プロパティのようなもの)
  getters: {
    // カート内の商品の合計金額を計算して返す
    totalPrice(state) {
      return state.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    // 数量が1以上の商品（カートに入っている商品）だけをフィルタリングして返す
    productsInCart(state) {
      return state.products.filter(p => p.quantity > 0);
    }
  },

  // 3. Mutations: Stateのデータを同期的に変更する唯一の方法
  mutations: {
    // 商品をカートに追加する (quantityを増やす)
    addToCart(state, product) {
      const item = state.products.find(p => p.id === product.id);
      if (item) {
        item.quantity++; // 商品が見つかれば数量を増やす
      }
    },
    // カート内の全ての商品数量を0にリセットする (カートを空にする)
    clearCart(state) {
      state.products.forEach(p => (p.quantity = 0));
    }
  },

  // 4. Actions: 非同期処理を実行し、その結果に基づいてMutationsをコミットする
  actions: {
    // 商品の購入処理を実行するアクション
    // commitを引数として受け取ることで、mutationsを呼び出すことができる
    async purchaseItems({ commit }) {
      console.log('購入処理を開始します...');
      try {
        // ここで実際のAPI呼び出しを行う (例: axios.post('/api/purchase', data);)
        // 今回はダミーとして3秒の遅延をシミュレート
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('API呼び出しが成功しました。');
        
        // API呼び出し成功後、カートをクリアするmutationをコミット
        commit('clearCart'); 
      } catch (error) {
        console.error('購入処理中にエラーが発生しました:', error);
        // 必要に応じて、購入失敗時のエラーハンドリング（例: エラーメッセージを表示するmutationをコミット）
      }
    }
  }
};