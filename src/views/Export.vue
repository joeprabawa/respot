<template>
  <v-layout row align-center justify-center>
    <v-flex xs12>
      <v-expansion-panel class="elevation-0">
        <v-expansion-panel-content v-for="(item, i) in items" :key="i">
          <template v-slot:header>
            <div class="display-1">
              <v-avatar color="white">
                <span class="blue-grey--text text--darken-4 headline">{{ item.jam }}</span>
              </v-avatar>
            </div>
          </template>
          <v-card>
            <v-card-text>
              <v-data-table
                :disable-initial-sort="true"
                :rows-per-page-items="option"
                :headers="headers"
                :items="item.songs"
                class="elevation-0"
              >
                <template v-slot:items="props">
                  <td>{{ props.index + 1 }}</td>
                  <td class="text-xs-left">{{ props.item.track.name }}</td>
                  <v-avatar :size="36" color="grey lighten-4">
                    <img :src="props.item.track.album.images[0].url" alt="avatar" />
                  </v-avatar>
                  <td class="text-xs-left">{{ props.item.track.artists[0].name }}</td>
                  <td class="text-xs-left">{{ props.item.track.album.release_date.substring(0, 4) }}</td>
                  <td class="text-xs-left">{{ props.item.category }}</td>
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
import { categorized, datatable } from "../utils/helpers";

export default {
  data: () => ({
    items: [],
    headers: datatable.headers,
    option: datatable.option,
    selected: []
  }),

  methods: {
    sorting(params, n) {
      return params
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1])
        .slice(0, n);
    },

    chunck(func) {
      let top = this.sorting(func.top40, 2),
        rec = this.sorting(func.recurrent, 3),
        cur = this.sorting(func.current, 3),
        old = this.sorting(func.oldies, 3),
        indo = this.sorting(func.indonesia, 3),
        combine = [...top, ...cur, ...rec, ...old, ...indo];
      return combine;
    },
    async final() {
      const playlists = [];
      for (let i = 6; i <= 26; i++) {
        const generateSongs = async () => {
          for (let index = i; index < 26; index++) {
            return this.chunck(await categorized());
          }
        };
        let obj = {
          jam: i,
          songs: await generateSongs()
        };
        playlists.push(obj);
      }
      return playlists;
    }
  },
  async mounted() {
    this.items = await this.final();
  }
};
</script>
