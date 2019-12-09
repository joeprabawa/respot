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
    ...mapActions(["getToken", "getPlaylist", "nextPlaylist"]),
    async categorized() {
      const reduced = await db.find({});
      const data = this.reducing(reduced);
      return data;
    },
    reducing(data) {
      return data.reduce((acc, v) => {
        const key = v.category.toLowerCase().replace(/\s/g, "");
        if (!acc[key]) acc[key] = [];
        acc[key].push(v);
        return acc;
      }, {});
    },
    chunck(func) {
      const data = func;
      const key = Object.keys(data);
      return key;
    }
  },

  computed: mapState(["dark", "next"]),
  async mounted() {
    this.getToken();
    this.getPlaylist();
    console.log(this.chunck(await this.categorized()));
  }
};
</script>
