<template>
  <v-flex class="mb-4">
    <div v-infinite-scroll="scroll" infinite-scroll-disabled="busy">
      <v-layout row wrap align-center justify-center>
        <v-progress-circular v-if="loading" :size="50" indeterminate></v-progress-circular>
        <v-flex xs12 sm4 md3 v-for="(item, index) in playlists" :key="item.id">
          <Card :index="index" :item="item"/>
        </v-flex>
      </v-layout>
      <v-snackbar
        :color="this.dark ? 'white' : 'blue-grey darken-4'"
        v-model="snackbar.on"
        bottom
        left
        :timeout="snackbar.timeout"
      >
        <span :class="this.dark ? 'black--text': 'white--text' ">{{ snackbar.msg }}</span>
        <v-btn color="pink" flat @click="snackbar.on = false">Close</v-btn>
      </v-snackbar>
      <v-layout row align-center justify-center>
        <v-progress-circular v-if="bottom" :size="30" indeterminate></v-progress-circular>
      </v-layout>
    </div>
  </v-flex>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Card from "@/components/CardPlaylist";

export default {
  components: {
    Card
  },
  data() {
    return {
      busy: false,
      bottom: false,
      snackbar: {
        on: false,
        timeout: 5000,
        msg: "No More Data"
      }
    };
  },
  methods: {
    ...mapActions(["nextPlaylist"]),

    async scroll() {
      if (this.next && !this.busy) {
        this.bottom = true;
        await this.nextPlaylist()
          .then(() => {
            this.bottom = false;
          })
          .catch(err => {
            return err;
          });
        this.busy = false;
      }

      if (this.next == null && !this.busy) {
        this.snackbar.on = true;
        this.busy = false;
      }
    }
  },
  mounted() {
    this.scroll();
  },

  computed: {
    ...mapState(["next", "dark", "loading"]),
    ...mapGetters(["playlists"])
  }
};
</script>
