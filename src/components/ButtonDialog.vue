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
      <v-toolbar fixed flat>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Playlist Detail / {{plyName}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-menu left offset-y v-if="$vuetify.breakpoint.xsOnly">
            <template v-slot:activator="{ on }">
              <v-btn icon flat v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index) in dropdowns"
                :key="index"
                @click="selectOption(item.value, item.text)"
              >
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

          <v-btn
            @click="selectOption(item.value, item.text)"
            @click.stop="dialog = true"
            v-else
            v-for="item in dropdowns"
            :key="item.value"
            flat
          >
            <v-icon class="mr-1">{{item.value === 'save'? 'save':'bookmark_border'}}</v-icon>
            {{item.value}}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-layout row wrap align-center justify-center>
        <v-flex md12 style="margin-top:5rem">
          <v-data-table
            v-model="selected"
            class="elevation-0"
            :rows-per-page-items="option"
            :headers="headers"
            :items="tracks"
            select-all
            :pagination.sync="pagination"
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
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
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
                <td>{{` ${props.item.sign } / ${props.item.mode == 0 ? 'Minor' :'Major'}`}}</td>
                <td>{{ props.item.remark}}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="snackbarProps.model" max-width="480">
      <v-card>
        <v-card-title
          primary-title
          :class="snackbarProps.type == 'yellow' ? 'yellow lighten-1' : 'teal'"
        >
          <div>
            <div
              class="headline"
              :class="snackbarProps.type == 'yellow' ? 'blue-grey--text text--darken-4' : 'white--text'"
            >{{snackbarProps.type == 'yellow' ? 'Warning' : 'Success'}}</div>
            <span
              :class="snackbarProps.type == 'yellow' ? 'blue-grey--text text--darken-4' : 'white--text'"
            >{{snackbarProps.type === 'success' && argument ==='save' ? 'success added to database' : snackbarProps.type === 'success' && argument === `${argument}` ? `Success changed song to ${snackbarProps.text}` :'Already in database!' }}</span>
          </div>
        </v-card-title>

        <v-card-text>
          <v-list two-line subheader>
            <v-subheader
              inset
            >{{snackbarProps.type ==='yellow' ? 'Un-checked these following' : 'Added'}} {{vals.length > 1 ? `${vals.length} songs` : `${vals.length} song`}}</v-subheader>

            <v-list-tile v-for="item in vals" :key="item.title" avatar>
              <v-list-tile-avatar>
                <v-icon
                  class="white--text"
                  :class="snackbarProps.type == 'yellow' ? 'yellow lighten-1 blue-grey--text text--darken-4' : 'teal'"
                >{{snackbarProps.type == 'yellow' ? 'folder' : 'done'}}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.track.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.track.artists[0].name }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-checkbox :value="item" v-model="vals"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="reset">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
        
       

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { mapCacheActions } from "vuex-cache";
import { db } from "@/nedb";

export default {
  name: "ButtonDialog",

  props: ["item", "plyName"],
  data: () => ({
    vals: [],
    argument: "",
    singleSelect: false,
    pagination: {
      sortBy: "name"
    },
    dropdowns: [
      {
        value: "save",
        text: "Save"
      },
      {
        value: "top",
        text: "Top 40"
      },
      {
        value: "cur",
        text: "Current"
      },
      {
        value: "rec",
        text: "Recurrent"
      },
      {
        value: "old",
        text: "Oldies"
      },
      {
        value: "id",
        text: "Indonesia"
      }
    ],
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
      { text: "Key/Mode", value: "mode" },
      { text: "Mark", value: "mark" }
    ],
    snackbarProps: {
      model: false,
      msg: null,
      type: "",
      text: ""
    }
  }),
  computed: {
    ...mapGetters(["tracks", "trackLoading"])
  },

  methods: {
    ...mapActions(["getTrack"]),
    ...mapMutations(["setLoading"]),
    checkOut() {
      console.log(this.selected);
    },

    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    reset() {
      this.snackbarProps.model = false;
      this.vals = [];
    },
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
    selectOption(args, tags) {
      if (args === "save") {
        this.argument = "save";
        this.selected.forEach(val => {
          db.find({}, (err, docs) => {
            const exist = docs.filter(v => {
              const same = this.selected.find(
                val => val.track.id === v.track.id
              );
              return same;
            });

            exist.length == 0
              ? (db.insert(val, (err, doc) => this.vals.push(doc)),
                (this.snackbarProps.model = true),
                (this.snackbarProps.type = "success"))
              : ((this.snackbarProps.model = true),
                (this.vals = [...exist]),
                (this.snackbarProps.type = "yellow"));
          });
        });
      }

      if (args != "save") {
        // if true, find the tracks array
        this.tracks.filter(v => {
          this.selected.forEach(val => {
            if (v.track.id === val.track.id) {
              v.category = tags;
              this.argument = args;
              this.snackbarProps.model = true;
              this.snackbarProps.text = tags;
              this.snackbarProps.msg = `${this.selected.length} ${
                this.selected.length > 1 ? "songs" : "song"
              }`;
              this.snackbarProps.type = "success";
            }
          });
          return v;
        });
      }
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

