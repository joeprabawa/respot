import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import infiniteScroll from "vue-infinite-scroll";
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(infiniteScroll);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
