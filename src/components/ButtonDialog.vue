<template>
  <v-dialog fullscreen v-model="dialog" lazy transition="scale-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon @click="detail(item.tracks.href)">
        <v-icon>{{ item.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Playlist Detail</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container fill-height>
        <v-layout row wrap align-center justify-center>
          <v-progress-circular v-if="trackLoading" :size="50" indeterminate></v-progress-circular>
          <v-flex md12 v-else>
            <v-data-table
              class="elevation-0"
              :rows-per-page-items="option"
              :headers="headers"
              :items="tracks"
            >
              <template v-slot:items="props">
                <tr>
                  <td>{{props.index+1}}</td>
                  <td>
                    <v-avatar :size="36" color="grey lighten-4">
                      <img :src="props.item.track.album.images[0].url" alt="avatar">
                    </v-avatar>
                  </td>
                  <td>
                    <v-tooltip v-if="props.item.track.name.length >= 10" dark bottom>
                      <template v-slot:activator="{ on }">
                        <p v-on="on">{{ truncate(props.item.track.name , 10) }}</p>
                      </template>
                      <span>{{props.item.track.name}}</span>
                    </v-tooltip>
                    <p v-else>{{ truncate(props.item.track.name , 10) }}</p>
                  </td>

                  <td>{{ props.item.track.artists[0].name }}</td>
                  <td>{{ props.item.track.album.release_date.substring(0,4) }}</td>
                  <td>{{ props.item.category }}</td>
                  <td>{{ props.item.tempo }}</td>
                  <td>{{ props.item.remark}}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "ButtonDialog",
  props: ["item"],
  data: () => ({
    img:
      " https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png",
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
      { text: "#", value: "index", sortable: false },
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
    async detail(payload) {
      this.dialog = true;
      await this.getTrack(payload);
    },
    close() {
      this.dialog = false;
    },

    truncate(str, length) {
      return str.length >= length ? `${str.substring(0, length)} ....` : str;
    }
  }
};
</script>

<style>
</style>

