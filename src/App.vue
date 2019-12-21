<template>
  <v-app :dark="dark">
    <Navbar />
    <v-content>
      <v-slide-y-reverse-transition :hide-on-leave="true">
        <router-view></router-view>
      </v-slide-y-reverse-transition>
    </v-content>
    <BottomNav />
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";

export default {
  name: "App",
  components: {
    Navbar,
    BottomNav
  },

  data() {
    return {};
  },
  methods: {
    ...mapActions(["getToken", "getPlaylist", "nextPlaylist"])
  },

  computed: mapState(["dark", "next"]),
  async mounted() {
    this.getToken();
    this.getPlaylist();
  }
};
</script>
<style >
main.v-content {
  padding: 0px !important;
}

html::-webkit-scrollbar {
  width: 10px;
}
html::-webkit-scrollbar-thumb {
  background: #666;
}
html::-webkit-scrollbar-track {
  background: #ddd;
}
</style>
