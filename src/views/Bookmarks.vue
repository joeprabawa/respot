<template>
  <v-layout row align-center justify-center>
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
  </v-layout>
</template>

<script>
import { db } from "@/nedb";
export default {
  data() {
    return {
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
      ]
    };
  },
  mounted() {
    db.find({}, (err, docs) => (this.tracks = docs));
  },
  methods: {
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
    }
  }
};
</script>

<style>
</style>
