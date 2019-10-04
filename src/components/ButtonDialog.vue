<template>
  <v-dialog
    fullscreen
    v-model="dialog"
    lazy
    transition="dialog-bottom-transition"
    origin="center center"
  >
    <template v-slot:activator="{ on }">
      <v-btn icon @click="detail(item.id)">
        <span :class="item.show ? 'custom-loader' : ''">
          <v-icon light>{{ item.show ? 'cached' : 'more_vert' }}</v-icon>
        </span>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Playlist Detail</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat text @click="toStudio">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-layout row wrap align-center justify-center>
        <v-flex md12>
          <DataTable
            :selectall="toggleAll"
            :truncate="truncate"
            :model="selected"
            :rows="option"
            :headers="headers"
            :items="tracks"
          />
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>
        
       

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import DataTable from "./DataTable";
export default {
  name: "ButtonDialog",
  components: {
    DataTable
  },
  props: ["item"],
  data: () => ({
    singleSelect: false,
    selected: [],
    dialog: false,
    option: [
      10,
      25,
      { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }
    ],

    headers: [
      { text: "#", value: "index", sortable: false, width: 10 },
      { text: "Art", value: "art" },
      {
        text: "Title",
        align: "left",
        value: "track.name"
      },
      { text: "Artist", value: "track.artists[0].name" },
      { text: "Year", value: "track.album.release_date" },
      { text: "Category", value: "category" },
      { text: "BPM", value: "tempo" },
      { text: "Mark", value: "mark" }
    ]
  }),
  computed: mapGetters(["tracks", "trackLoading"]),

  methods: {
    ...mapActions(["getTrack"]),
    ...mapMutations(["setLoading"]),
    detail(payload) {
      this.item.show = !this.item.show;
      this.getTrack(payload).then(() => {
        this.dialog = true;
      });
    },
    close() {
      this.dialog = false;
      this.item.show = false;
    },

    truncate(str, length) {
      return str.length >= length ? `${str.substring(0, length)} ....` : str;
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.tracks.slice();
    },
    toStudio() {
      return this.selected.forEach(val => {
        return this.$store.commit("storeToStudio", val);
      });
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

