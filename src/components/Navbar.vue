<template>
  <v-toolbar flat>
    <v-icon large>mdi-spotify</v-icon>
    <v-toolbar-title class="text-uppercase">vuespot</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>

    <v-btn @click="darkMode" icon>
      <v-icon>mdi-brightness-6</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  methods: mapMutations(["darkMode"])
};
</script>

<style>
</style>
