import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  iconfont: "mdi",
  theme: {
    primary: "#F1EEE5",
    secondary: "#404c27",
    accent: "#787e91",
    error: "#b71c1c"
  }
});
