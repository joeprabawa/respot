<template>
  <v-card :color="dark ? 'dark': 'primary'" flat :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : ''">
    <v-container v-if="$vuetify.breakpoint.xsOnly">
      <v-layout row wrap align-start>
        <v-flex xs2>
          <v-avatar size="90" color="secondary">
            <img loading="lazy" :src="item.images[0].url">
          </v-avatar>
        </v-flex>
        <v-flex xs10>
          <v-card-title :class="dark ? 'primary--text custom  ': 'secondary--text custom  ' ">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="title font-weight-bold text-capitalize" v-html="item.name"></div>
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
      :class="dark ? 'dark' : 'white' && $vuetify.breakpoint.xsOnly ? 'accent': 'white'"
    >
      <v-btn flat>select</v-btn>
      <v-spacer></v-spacer>
      <Dialog :item="item"/>
    </v-card-actions>
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
    return {};
  },
  computed: {
    ...mapState(["dark"])
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
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Raleway:300");

.v-sheet {
  border-radius: 6px;
  border: 0.06rem solid #cccccc;
}

.custom {
  margin: -10px 0 0 4rem;
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
