<template>
  <v-bottom-nav class="hidden-sm-and-up" app :value="true" fixed>
    <v-btn to="/" color="accent" flat value="recent">
      <span class="font-weight-bold caption">Playlists</span>
      <v-icon>mdi-spotify</v-icon>
    </v-btn>

    <v-btn to="/bookmarks" color="accent" flat value="favorites">
      <span class="font-weight-bold caption">Selected</span>
      <v-icon>class</v-icon>
    </v-btn>

    <v-btn to="/export" color="accent" flat value="nearby">
      <span class="font-weight-bold caption">Exported</span>
      <v-icon>place</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default {
  name: "BottomNav",
  data() {
    return {
      bottomNav: "recent"
    };
  }
};
</script>

<style>
</style>
