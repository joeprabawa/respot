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
import db from "@/nedb";

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
    const reduced = db.find({}).then(doc => {
      const reduced = doc.reduce((acc, v) => {
        var key = acc[v.category];
        if (!acc[v.category]) {
          acc[v.category] = [];
        }
        acc[v.category].push(v);
        return acc;
      }, {});
      return reduced;
    });
    const data = await reduced;
    console.log(data);
  }
};
</script>
