<template>
  <v-app :dark="dark">
    <Navbar/>
    <v-content>
      <v-container grid-list-md class="pa-4">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Navbar from "./components/Navbar";

export default {
  name: "App",
  components: {
    Navbar
  },

  data() {
    return {
      //
    };
  },
  methods: mapActions(["getToken", "getPlaylist"]),
  computed: mapState(["dark"]),
  mounted() {
    this.getToken();
    this.getPlaylist();
  }
};
</script>
