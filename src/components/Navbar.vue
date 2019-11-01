<template>
  <v-toolbar class="py-1" flat :color="dark ? 'grey darken-4' : 'accent'">
    <v-btn icon to="/">
      <v-icon large>mdi-spotify</v-icon>
    </v-btn>

    <v-toolbar-title v-show="!$vuetify.breakpoint.xsOnly" class="text-uppercase">
      <span to="/" class="teal--text text--lighten-1">vue</span> spot
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-slide-x-reverse-transition>
      <v-autocomplete
        v-show="show"
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        class="mx-3"
        flat
        hide-no-data
        hide-details
        label="Search"
        solo-inverted
      ></v-autocomplete>
    </v-slide-x-reverse-transition>
    <v-spacer></v-spacer>
    <v-btn @click="show = !show" icon>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn to="/bookmarks" class="hidden-sm-and-down" icon>
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
import { mapMutations, mapState } from "vuex";
import { setTimeout } from "timers";

export default {
  data: () => ({
    hint: "",
    loading: false,
    items: [],
    model: null,
    search: "",
    show: false,
    select: null,
    states: []
  }),

  watch: {
    async search(val) {
      let uri = `https://api.spotify.com/v1/search?q=${val}&type=album,artist,track&limit=10`;
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

      setTimeout(async () => {
        this.items = await items.map(({ name }) => {
          return name;
        });
      }, 1500);
    }
  },
  methods: mapMutations(["darkMode"]),
  computed: mapState(["token", "dark"])
};
</script>

<style>
</style>
