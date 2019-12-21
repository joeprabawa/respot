<template>
  <v-toolbar class="py-1" flat :color="dark ? 'grey darken-4' : 'accent'">
    <v-btn icon to="/">
      <v-icon large>mdi-spotify</v-icon>
    </v-btn>
    <v-toolbar-title v-show="!$vuetify.breakpoint.xsOnly" class="text-uppercase">
      <span to="/" class="teal--text text--lighten-1">vue</span> spot
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-btn to="/bookmarks" class="hidden-sm-and-down" icon>
      <v-icon>mdi-database-settings</v-icon>
    </v-btn>
    <v-btn to="/export" class="hidden-sm-and-down" icon>
      <v-icon>book</v-icon>
    </v-btn>
    <v-btn @click="darkMode" icon>
      <v-icon>mdi-brightness-6</v-icon>
    </v-btn>
    <v-btn class="hidden-sm-and-down" icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import debounce from "../utils/debounce";
import { mapMutations, mapState } from "vuex";

export default {
  data: () => ({
    search: null,

    debounced: ""
  }),

  watch: {
    search: debounce(function(newVal) {
      this.debounced = newVal;
      this.searhQuery(this.debounced);
      this.model = true;
      if (newVal == "") this.model = false;
    }, 1000)
  },
  methods: {
    ...mapMutations(["darkMode"]),
    async searhQuery(q) {
      this.loading = true;
      let uri = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=10`;
      const encoded = await encodeURI(uri);

      const options = {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      };

      const fetchSearch = await fetch(encoded, options);
      const json = await fetchSearch.json();
      const data = await json;
      const { items } = data.tracks;
      this.items = items;

      this.loading = false;
    }
  },
  computed: mapState(["token", "dark"])
};
</script>

<style>
</style>
