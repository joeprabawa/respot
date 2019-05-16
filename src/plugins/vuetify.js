import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  iconfont: "mdi",
  theme: {
    primary: "#F1EEE5",
    secondary: "#4c5828",
    accent: "#b0c499",
    error: "#a84122"
  }
});
