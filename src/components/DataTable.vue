<template>
  <div>
    <v-data-table
      v-model="model"
      class="elevation-0"
      :rows-per-page-items="rows"
      :headers="headers"
      :items="items"
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
              @click.stop="selectall"
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
  </div>
</template>

<script>
export default {
  name: "Datatable",
  props: ["model", "rows", "headers", "items", "truncate", "selectall"]
};
</script>

