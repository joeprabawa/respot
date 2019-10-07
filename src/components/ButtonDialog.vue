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
          <v-data-table
            v-model="selected"
            class="elevation-0"
            :rows-per-page-items="option"
            :headers="headers"
            :items="tracks"
            item-key="track.id"
          >
            <template v-slot:headers="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.stop="toggleAll"
                  ></v-checkbox>
                </th>
                <th v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
              </tr>
            </template>
            <template v-slot:items="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                  <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                </td>
                <td>{{props.index+1}}</td>
                <td>
                  <v-avatar :size="36" color="grey lighten-4">
                    <img :src="props.item.track.album.images[0].url" alt="avatar" />
                  </v-avatar>
                </td>
                <td>
                  <v-tooltip v-if="props.item.track.name.length >= 50" dark bottom>
                    <template v-slot:activator="{ on }">
                      <p v-on="on">{{ truncate(props.item.track.name , 50) }}</p>
                    </template>
                    <span>{{props.item.track.name}}</span>
                  </v-tooltip>
                  <p v-else>{{ truncate(props.item.track.name , 50) }}</p>
                </td>

                <td>
                  <v-tooltip dark bottom>
                    <template v-slot:activator="{ on }">
                      <p v-on="on">{{ truncate(props.item.track.artists[0].name, 50) }}</p>
                    </template>
                    <span>{{props.item.track.artists[0].name}}</span>
                  </v-tooltip>
                </td>
                <td>{{ props.item.track.album.release_date.substring(0,4) }}</td>
                <td>{{ props.item.category }}</td>
                <td>{{ props.item.tempo }}</td>
                <td>{{ props.item.remark}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
    <v-snackbar
      bottom
      left
      multi-line
      :color="snackbarProps.type"
      class="grey--text text--darken-4"
      v-model="snackbarProps.model"
    >
      <span class="text-capitalize">
        <h3>{{ snackbarProps.msg }}</h3>sudah ada pada database
      </span>
      <v-btn class="grey--text text--darken-4" flat text @click="snackbarProps.model = false">Close</v-btn>
    </v-snackbar>
  </v-dialog>
</template>
        
       

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "ButtonDialog",

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
    ],
    snackbarProps: {
      model: false,
      msg: null,
      type: ""
    }
  }),
  computed: {
    ...mapGetters(["tracks", "trackLoading"]),
    getSelected() {
      return this.selected;
    }
  },

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
        const state = this.$store.state.studio;
        const values = state.find(value => value.track.id === val.track.id);

        // Validation tracks exist
        if (state.indexOf(values) > -1) {
          const { id, name } = values.track;
          this.snackbarProps.model = true;
          this.snackbarProps.msg = `${id} - ${name}`;
          this.snackbarProps.type = "yellow";
        } else {
          this.$store.commit("storeToStudio", val);
        }
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

