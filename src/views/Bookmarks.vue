<template>
  <v-layout row align-center justify-center>
    <v-flex xs12>
      <v-fab-transition>
        <v-btn
          @click="remove"
          v-show="selected.length"
          :color="this.$store.state.dark ? 'white':'blue-grey darken-4'"
          fixed
          bottom
          right
          fab
        >
          <v-icon :color="this.$store.state.dark ? 'black':'white'">add</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-tabs grow color="grey darken-2" dark slider-color="yellow">
        <v-tab v-for="(n,i) in tabs" :key="i" ripple>
          <v-icon left>{{n.icon}}</v-icon>
          {{ n.name }}
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-data-table
              v-model="selected"
              class="elevation-0"
              :rows-per-page-items="option"
              :headers="headers"
              :pagination.sync="pagination"
              :items="tracks"
              select-all
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
                    :class="[
                'column sortable',
                pagination.descending ? 'desc' : 'asc',
                header.value === pagination.sortBy ? 'active' : ''
              ]"
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
                  <td>{{ props.index + 1 }}</td>
                  <td>
                    <v-avatar :size="36" color="grey lighten-4">
                      <img :src="props.item.track.album.images[0].url" alt="avatar" />
                    </v-avatar>
                  </td>
                  <td>
                    <v-tooltip v-if="props.item.track.name.length >= 50" dark bottom>
                      <template v-slot:activator="{ on }">
                        <p v-on="on">{{ truncate(props.item.track.name, 50) }}</p>
                      </template>
                      <span>{{ props.item.track.name }}</span>
                    </v-tooltip>
                    <p v-else>{{ truncate(props.item.track.name, 50) }}</p>
                  </td>

                  <td>
                    <v-tooltip dark bottom>
                      <template v-slot:activator="{ on }">
                        <p v-on="on">{{ truncate(props.item.track.artists[0].name, 50) }}</p>
                      </template>
                      <span>{{ props.item.track.artists[0].name }}</span>
                    </v-tooltip>
                  </td>
                  <td>{{ props.item.track.album.release_date.substring(0, 4) }}</td>
                  <td>{{ props.item.category }}</td>
                  <td>{{ props.item.tempo }}</td>
                  <td>
                    {{
                    ` ${props.item.sign} / ${
                    props.item.mode == 0 ? "Minor" : "Major"
                    }`
                    }}
                  </td>
                  <td>{{ props.item.remark }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-treeview :items="items">
                <template v-slot:prepend="{ item }">
                  <v-icon
                    v-if="item.children"
                    v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                  ></v-icon>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <v-snackbar :timeout="0" v-model="snackbar" bottom left>
      {{ text }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import db from "@/nedb";

export default {
  data() {
    return {
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
      items: []
    };
  },
  async mounted() {
    db.find({}).then(docs => {
      this.tracks = docs;
    });

    await this.toItems();
  },

  methods: {
    async toItems() {
      const {
        top40,
        current,
        recurrent,
        oldies,
        indonesia
      } = await this.categorized();
      const obj = [
        {
          name: `Top 40 (${top40.length})`,
          children: top40.map(v => {
            return {
              name: v.track.name,
              children: [
                { name: `Artists : ${v.track.artists[0].name}` },
                { name: `Category : ${v.category}` },
                { name: `Release Date : ${v.track.album.release_date}` }
              ]
            };
          })
        },
        {
          name: `Current (${current.length})`,
          children: current.map(v => {
            return { name: v.track.name };
          })
        },
        {
          name: `Recurrent (${recurrent.length})`,
          children: recurrent.map(v => {
            return { name: v.track.name };
          })
        },
        {
          name: `Oldies (${oldies.length})`,
          children: oldies.map(v => {
            return { name: v.track.name };
          })
        },
        {
          name: `Indonesia (${indonesia.length})`,
          children: indonesia.map(v => {
            return { name: v.track.name };
          })
        }
      ];
      return (this.items = [...obj]);
    },
    async categorized() {
      const reduced = await db.find({});
      const data = this.reducing(reduced);
      return data;
    },
    reducing(data) {
      return data.reduce((acc, v) => {
        const key = v.category.toLowerCase().replace(/\s/g, "");
        if (!acc[key]) acc[key] = [];
        acc[key].push(v);
        return acc;
      }, {});
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    truncate(str, length) {
      return str.length >= length ? `${str.substring(0, length)} ....` : str;
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.tracks.slice();
    },
    remove() {
      this.snackbar = true;
      const deleted = this.selected.map(v => {
        db.remove({ "track.id": v.track.id }, { multi: true }).then(doc => doc);
        return { ...v, showing: true };
      });

      this.text = `${deleted.length} songs deleted`;

      db.find({}).then(docs => {
        this.tracks = docs;
      });
    }
  }
};
</script>

<style></style>
