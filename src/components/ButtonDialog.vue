<template>
  <v-layout align-center justify-center row fill-height>
    <v-dialog
      v-model="dialog"
      lazy
      fullscreen
      hide-overlay
      origin="center center"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon @click="detail(item.tracks.href)">
          <v-icon>{{ item.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="dialog = false">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="text-xs-center" v-if="loader">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-data-table
          v-else
          :rows-per-page-items="option"
          :headers="headers"
          :items="tracks"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.track.name }}</td>
            <td>{{ props.item.track.artists[0].name }}</td>
            <td>{{ props.item.track.album.release_date }}</td>
            <td>{{ props.item.carbs }}</td>
            <td>{{ props.item.protein }}</td>
            <td>{{ props.item.iron }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "ButtonDialog",
  props: ["item"],
  data: () => ({
    ref: "",
    dialog: false,
    notifications: false,
    sound: true,
    loading: false,
    widgets: false,
    option: [
      10,
      25,
      { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }
    ],

    headers: [
      {
        text: "Title",
        width: "400",
        align: "left",
        sortable: false,
        value: "title"
      },
      { text: "Artist", value: "Artist" },
      { text: "Year", value: "Year" },
      { text: "Category", value: "Category" },
      { text: "BPM", value: "BPM" }
    ]
  }),
  computed: mapGetters(["tracks", "loader"]),
  methods: {
    ...mapActions(["getTrack"]),
    ...mapMutations(["setLoading"]),
    async detail(payload) {
      this.dialog = true;
      await this.getTrack(payload);
    }
  }
};
</script>

<style>
</style>

