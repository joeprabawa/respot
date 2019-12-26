<template>
  <v-flex xs12>
    <v-fab-transition>
      <v-btn
        @click="remove"
        v-show="this.$store.state.selected.length"
        :color="this.$store.state.dark ? 'white':'blue-grey darken-4'"
        fixed
        bottom
        right
        fab
      >
        <v-icon :color="this.$store.state.dark ? 'black':'white'">delete_outline</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-tabs grow color="grey darken-2" dark slider-color="yellow">
      <v-tab v-for="(n,i) in tabs" :key="i" ripple>
        <v-icon left>{{n.icon}}</v-icon>
        {{ n.name }}
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <DataTable :items="tracks" />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-layout row>
          <v-flex xs4 sm4 md4>
            <v-navigation-drawer height="100vh" width="600px" value="true">
              <v-list>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon>home</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Category</v-list-tile-title>
                </v-list-tile>

                <v-list-group prepend-icon="account_circle" value="true">
                  <template v-slot:activator>
                    <v-list-tile>
                      <v-list-tile-title>Category</v-list-tile-title>
                    </v-list-tile>
                  </template>
                  <v-list-group
                    v-for="(item, i) in items"
                    :key="i"
                    no-action
                    sub-group
                    value="true"
                  >
                    <template v-slot:activator>
                      <v-list-tile>
                        <v-list-tile-title>{{item.name}}</v-list-tile-title>
                      </v-list-tile>
                    </template>

                    <v-list-tile
                      @click="getSong(song.id)"
                      v-for="(song,i) in item.children"
                      :key="i"
                    >
                      <v-list-tile-action>
                        <v-icon>folder</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>{{song.name}}</v-list-tile-content>
                    </v-list-tile>
                  </v-list-group>
                </v-list-group>
              </v-list>
            </v-navigation-drawer>
          </v-flex>
          <v-flex xs8 sm8 md8 text-xs-center>
            <v-card height="100vh" flat>
              <v-card-text>
                <v-scroll-y-transition mode="out-in">
                  <div
                    v-if="!song._id"
                    class="title grey--text text--lighten-1 font-weight-light"
                    style="align-self: center;"
                  >Select a User</div>
                  <v-card v-else :key="song.track.id" class="pt-4 ma-auto" flat max-width="400">
                    <v-card-text>
                      <v-avatar v-if="song.track.id" size="200">
                        <v-img :src="song.track.album.images[0].url" class="mb-4"></v-img>
                      </v-avatar>
                      <h3 class="headline mb-2">{{ song.track.name }}</h3>
                      <div class="mb-2">{{ song.track.artists[0].name }}</div>
                      <div class="subheading font-weight-bold">{{ song.track.album.name }}</div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-layout tag="v-card-text" text-xs-left wrap>
                      <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>Release Date :</v-flex>
                      <v-flex>{{ song.track.album.release_date }}</v-flex>
                      <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>Category :</v-flex>
                      <v-flex>{{ song.category }}</v-flex>
                      <v-flex tag="strong" xs5 text-xs-right mr-3 mb-2>BPM / Mark :</v-flex>
                      <v-flex>
                        {{ `${song.tempo} /
                        ${song.sign} - ${
                        song.mode == 0 ? "Minor" : "Major"
                        }`
                        }}
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-scroll-y-transition>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs>
    <v-snackbar :timeout="0" v-model="snackbar" bottom left>
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-flex>
</template>

<script>
import db from "@/nedb";
import { categorized, datatable } from "../utils/helpers";
import DataTable from "@/components/DataTable";

export default {
  components: {
    DataTable
  },
  data() {
    return {
      headers: datatable.headers,
      option: datatable.option,
      song: {},
      tabs: [
        {
          name: "Table View",
          icon: "view_list"
        },
        {
          name: "Tree View",
          icon: "vertical_split"
        }
      ],
      text: "",
      snackbar: false,
      tracks: [],
      singleSelect: false,
      items: [],
      value: 0
    };
  },

  async mounted() {
    db.find({}).then(docs => {
      this.tracks = docs;
    });
    await this.toItems();
  },

  methods: {
    getSong(id) {
      this.song = this.tracks.find(v => v.track.id === id);
      return this.song;
    },
    treeViewData(data) {
      return data.map(v => {
        return {
          id: v.track.id,
          name: v.track.name
        };
      });
    },
    async toItems() {
      const {
        top40,
        current,
        recurrent,
        oldies,
        indonesia
      } = await categorized();
      const obj = [
        {
          name: `Top 40 (${top40.length})`,
          children: this.treeViewData(top40)
        },
        {
          name: `Current (${current.length})`,
          children: this.treeViewData(current)
        },
        {
          name: `Recurrent (${recurrent.length})`,
          children: this.treeViewData(recurrent)
        },
        {
          name: `Oldies (${oldies.length})`,
          children: this.treeViewData(oldies)
        },
        {
          name: `Indonesia (${indonesia.length})`,
          children: this.treeViewData(indonesia)
        }
      ];
      return (this.items = [...obj]);
    },
    remove() {
      this.$store.state.selected.map(async v => {
        const del = await db.remove(
          { "track.id": v.track.id },
          { multi: true }
        );
        this.snackbar = true;
        this.text = `${(this.value += del)} songs deleted`;
        return v;
      });
      // Realtime listener
      db.find({}).then(docs => {
        this.tracks = docs;
      });
    }
  }
};
</script>

<style>
.v-navigation-drawer::-webkit-scrollbar {
  width: 5px;
}
.v-navigation-drawer::-webkit-scrollbar-thumb {
  background: #666;
}
.v-navigation-drawer::-webkit-scrollbar-track {
  background: #ddd;
}
.v-list__tile.v-list__tile--link.theme--dark {
  border-radius: 15px;
  margin: auto 10px;
}
</style>
