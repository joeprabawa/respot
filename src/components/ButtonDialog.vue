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
      <v-toolbar flat>
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
        <v-flex md12>
          <DataTable :items="tracks" />
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog scrollable v-model="snackbarProps.model" max-width="480">
      <v-card style="border-radius:15px">
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

        <v-card-text style="height: 350px;">
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
              <v-btn
                v-if="snackbarProps.type == 'yellow'"
                @click="remove(item)"
                fab
                flat
                dark
                small
                :color="dark ? 'yellow lighten-1': 'black'"
              >
                <v-icon dark>remove</v-icon>
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            :color="snackbarProps.type == 'yellow' && dark ? 'white' : snackbarProps.type == 'yellow' && !dark ? 'black':'teal lighten-3'  "
            flat="flat"
            @click="reset"
          >Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="disable"
            v-if="snackbarProps.type == 'yellow'"
            :color="snackbarProps.type == 'yellow' && dark ? 'yellow lighten-1' : snackbarProps.type == 'yellow' && !dark ? 'black':'teal lighten-3'  "
            flat="flat"
            @click="save"
          >proceed anyaway</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
        
       

<script>
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import DataTable from "@/components/DataTable";

import db from "@/nedb";
import { datatable } from "../utils/helpers";

export default {
  name: "ButtonDialog",
  components: {
    DataTable
  },

  props: ["item", "plyName"],
  data: () => ({
    datas: [],
    vals: [],
    disable: null,
    argument: "",
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
    dialog: false,
    option: datatable.option,
    headers: datatable.headers,
    snackbarProps: {
      model: false,
      msg: null,
      type: "",
      text: ""
    }
  }),

  computed: {
    ...mapGetters(["tracks", "trackLoading"]),
    ...mapState(["dark", "selected"])
  },

  methods: {
    ...mapActions(["getTrack"]),
    ...mapMutations(["setLoading"]),

    remove({ track: { id } }) {
      this.selected = this.selected.filter(v => v.track.id !== id);
      this.vals = this.vals.filter(v => v.track.id !== id);
      if (this.vals.length == 0) this.disable = false;
    },

    async save() {
      let docs = await db.find({});
      this.datas = await docs;
      const res = this.selected.filter(val => {
        return !this.datas.find(v => v.track.id === val.track.id);
      });

      if (this.vals.length == 0) {
        this.reset();
      } else {
        db.insert(res).then(doc => {
          this.vals = doc;
          this.snackbarProps.model = true;
          this.snackbarProps.type = "success";
        });
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
      this.$store.commit("setSelected", []);
    },

    selectOption(args, tags) {
      if (args === "save") {
        this.argument = "save";

        this.selected.forEach(val => {
          db.find({}).then(async docs => {
            const exist = docs.filter(v => {
              const same = this.selected.find(
                val => val.track.id === v.track.id
              );
              return same;
            });

            let documents = await db.find({});
            this.datas = await documents;

            const res = this.selected.filter(val => {
              return !this.datas.find(v => v.track.id === val.track.id);
            });

            if (exist.length == 0) {
              db.insert(val).then(doc => {
                this.vals.push(doc);
                this.snackbarProps.model = true;
                this.snackbarProps.type = "success";
              });
            } else if (res.length === 0) {
              this.vals = exist;
              this.disable = true;
              this.snackbarProps.model = true;
              this.snackbarProps.type = "yellow";
            } else if (res.length >= 1) {
              this.vals = exist;
              this.disable = false;
              this.snackbarProps.model = true;
              this.snackbarProps.type = "yellow";
            } else {
              this.snackbarProps.model = true;
              this.vals = [...exist];
              this.snackbarProps.type = "yellow";
            }
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
.v-dialog--fullscreen::-webkit-scrollbar-thumb {
  background: #666;
}
.v-dialog--fullscreen::-webkit-scrollbar-track {
  background: #ddd;
}
.v-dialog--fullscreen::-webkit-scrollbar {
  width: 10px;
}
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

