<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-5">
          <v-card-title class="text-h5 font-weight-bold text-center justify-center mb-4">
            このアプリケーションについて
          </v-card-title>

          <v-card-text>
            <h3 class="text-h6 mb-2">アプリの目的</h3>
            <p class="text-body-1 mb-4">
              このアプリケーションは、販売システムの構造を作成し、期待通りに機能しているかの確認として利用されます。それと、気象庁が提供する最新の天気予報データを、シンプルで直感的なインターフェースで表示するウェブサイトです。今日の天気概要から、明日以降の週間予報まで、お住まいの地域や関心のある地域の気象情報を素早く確認できます。
              データの取得・表示ロジックを学びながら開発されました。
            </p>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-2">使用技術スタック</h3>
            <ul class="mb-4">
              <li><strong>フレームワーク:</strong> Vue.js (Vue Router, Vuex)</li>
              <li><strong>UIライブラリ:</strong> Vuetify</li>
              <li><strong>データ取得:</strong> JavaScript Fetch API</li>
              <li><strong>データソース:</strong> 
              <p class="text-body-1 mb-4">
              <a href="https://www.jma.go.jp/bosai/common/const/area.json" target="_blank" rel="noopener noreferrer">エリアの取得</a> 
              、<a href="https://www.jma.go.jp/bosai/forecast/data/overview_forecast/130000.json" target="_blank" rel="noopener noreferrer">天気の概要を取得（東京の例）</a>
              、<a href="https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json" target="_blank" rel="noopener noreferrer">天気の詳細を取得（東京の例）</a>
              </p></li>
              <li><strong>デプロイ:</strong> Azure Static Web Apps </li>
            </ul>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-2">免責事項</h3>
            <p class="text-body-2 text-grey-darken-1">
              本アプリケーションで提供される天気情報は、気象庁が発表するデータに基づいておりますが、その正確性、完全性、最新性を保証するものではありません。
              本アプリケーションの利用により生じた、いかなる損害等についても、開発者は一切の責任を負いかねます。
              気象情報のご利用にあたっては、必ず気象庁公式サイトなどの信頼できる情報源も併せてご確認ください。
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AboutView',
};
</script>
