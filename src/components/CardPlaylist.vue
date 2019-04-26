<template>
  <v-card>
    <v-img :src="item.images[0].url" height="200px"></v-img>
    <v-card-title>
      <div>
        <div class="subheading text-capitalize text-truncate" v-html="item.name"></div>
        <!-- <span class="grey--text text-capitalize">{{item.id}}</span> -->
      </div>
    </v-card-title>

    <v-card-actions>
      <v-btn flat>Share</v-btn>
      <v-btn flat color="purple">Explore</v-btn>
      <v-spacer></v-spacer>
      <Dialog :item="item"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import Dialog from "./ButtonDialog";

export default {
  name: "CardPlaylist",
  props: ["item"],
  components: {
    Dialog
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
