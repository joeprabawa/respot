<template>
  <v-layout row align-center justify-center>
    <v-flex xs12>
      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-content v-for="(item,i) in items" :key="i">
          <template v-slot:header>
            <div class="display-1">{{item.jam}}</div>
          </template>
          <v-card>
            <v-card-text>
              <v-data-table
                :rows-per-page-items="option"
                :headers="headers"
                :items="item.songs"
                class="elevation-0"
              >
                <template v-slot:items="props">
                  <td>{{ props.index + 1 }}</td>
                  <td class="text-xs-left">{{ props.item.track.name }}</td>
                  <td class="text-xs-left">{{ props.item.track.artists[0].name }}</td>
                  <td class="text-xs-left">{{ props.item.track.album.release_date.substring(0, 4) }}</td>
                  <td class="text-xs-left">{{ props.item.category}}</td>
                  <td class="text-xs-left">{{ props.item.tempo }}</td>
                  <td>
                    {{
                    ` ${props.item.sign} / ${
                    props.item.mode == 0 ? "Minor" : "Major"
                    }`
                    }}
                  </td>
                  <td>{{ props.item.remark }}</td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>


<script>
import db from "@/nedb";

export default {
  data: () => ({
    items: [],
    pagination: {
      sortBy: "name"
    },

    selected: [],

    option: [
      14,
      25,
      { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }
    ],

    headers: [
      { text: "#", value: "index", sortable: false },

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
    ]
  }),
  methods: {
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
    chunck(func) {
      let top = func.top40
          .sort((a, b) => Math.random() - Math.random())
          .slice(0, 2),
        rec = func.recurrent
          .sort((a, b) => Math.random() - Math.random())
          .slice(0, 3),
        cur = func.current
          .sort((a, b) => Math.random() - Math.random())
          .slice(0, 3),
        old = func.oldies
          .sort((a, b) => Math.random() - Math.random())
          .slice(0, 3),
        indo = func.indonesia
          .sort((a, b) => Math.random() - Math.random())
          .slice(0, 3),
        combine = [...top, ...cur, ...rec, ...old, ...indo];
      return combine;
    },
    final(params) {
      const playlists = [];
      for (let i = 6; i <= 26; i++) {
        let obj = {
          jam: i,
          songs: params
        };
        playlists.push(obj);
      }
      return playlists;
    }
  },
  async mounted() {
    this.items = this.final(this.chunck(await this.categorized()));
    console.log(this.final(this.chunck(await this.categorized())));
    console.log(this.items);
  }
};
</script>