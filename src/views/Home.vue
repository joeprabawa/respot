<template>
  <div class="app">
    <h2 class="display-1 font-weight-light mb-4">Your Playlist</h2>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 v-for="item in playlists" :key="item.id">
        <Card :item="item"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Card from "@/components/CardPlaylist";
export default {
  components: {
    Card
  },
  data() {
    return {};
  },
  computed: mapState(["playlists"])
};
</script>
