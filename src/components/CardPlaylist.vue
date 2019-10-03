<template>
  <v-card
    flat
    :color="dark ? 'dark': 'primary'"
    :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : 'ma-2'"
  >
    <v-container fill-height v-if="$vuetify.breakpoint.xsOnly">
      <v-layout align-start justify-center row>
        <v-flex xs2>
          <v-avatar :size="95">
            <v-img max-height="125" :src="item.images[0].url"></v-img>
          </v-avatar>
        </v-flex>
        <v-flex xs10>
          <v-card-title :class="dark ? 'primary--text custom  ': 'secondary--text custom  ' ">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="title text-capitalize" v-html="item.name"></div>
                  <div class="mt-1 text-uppercase small" v-html=" `${item.owner.display_name} ` "></div>
                </template>
                <span>{{item.name}}</span>
              </v-tooltip>
              <v-chip>
                <v-avatar class="teal font-weight-bold">{{item.tracks.total}}</v-avatar>
                <span class="text-capitalize">tracks</span>
              </v-chip>
            </div>
          </v-card-title>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="content" v-else>
      <v-card-title class="ml-0">
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
                class="caption font-weight-bold text-capitalize"
                v-html="`${index+1}. ${judulTruncate(item.name)}`"
              ></div>
            </template>
            <span>{{item.name}}</span>
          </v-tooltip>
        </div>
      </v-card-title>
      <v-img :src="item.images[0].url" height="200px"></v-img>
    </div>

    <v-card-actions
      :class="dark ? 'grey darken-2' : 'white' && $vuetify.breakpoint.xsOnly ? 'accent': 'white'"
    >
      <v-btn @click="select(item.tracks.href)" flat>select</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="indo(item.id)" flat>mark as indo</v-btn>
      <Dialog :item="item" />
    </v-card-actions>
    <v-snackbar color="success" v-model="snackbar">
      {{ msg }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import Dialog from "./ButtonDialog";

export default {
  name: "CardPlaylist",
  props: ["item", "index"],
  components: {
    Dialog
  },
  data() {
    return {
      snackbar: false,
      msg: ""
    };
  },
  computed: {
    ...mapState(["dark", "trackLoading", "playlists"])
  },

  methods: {
    judulTruncate(value) {
      let words = value.split(" ");
      if (words.length >= 3) {
        let slice = words.slice(0, 2);
        return `${slice.join(" ")} ..`;
      } else {
        return value;
      }
    },
    select(args) {
      return args;
    },
    indo(args) {
      this.$store.commit("changeIndo", args);
      this.snackbar = true;
      const plyName = this.playlists.find(({ id }) => id === args);
      this.msg = `Playlists ${plyName.name} berhasil di Mark Indonesia`;
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Raleway:300");

.v-sheet {
  border-radius: 6px;
  /* border: 0.06rem solid #cccccc; */
}

.custom {
  margin: -12px 0 0 4rem;
  font-family: "Raleway";
}

.v-chip {
  margin: 10px -2px;
}
.small {
  font-size: 0.7rem;
  letter-spacing: 0.12rem;
  font-weight: 300;
}
</style>
