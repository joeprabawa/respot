<template>
  <v-layout row align-center justify-center>
    <v-flex xs12>
      <v-expansion-panel expand class="elevation-0">
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
              <DataTable :items="item.songs" />
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</template>

<script>
import { categorized, datatable } from "../utils/helpers";
import DataTable from "@/components/DataTable";

export default {
  components: {
    DataTable
  },
  data: () => ({
    items: [],
    headers: datatable.headers,
    option: datatable.option,
    selected: []
  }),

  methods: {
    sorting(params, n) {
      // return params
      //   .map(a => [Math.random(), a])
      //   .sort((a, b) => a[0] - b[0])
      //   .map(a => a[1])
      //   .slice(0, n);

      var m = params.length,
        t,
        i;

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = params[m];
        params[m] = params[i];
        params[i] = t;
      }

      return params.slice(0, n);
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
