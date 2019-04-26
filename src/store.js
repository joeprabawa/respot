import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    playlists: [],
    tracks: [],
    dark: true,
    loading: true

  },
  mutations: {
    darkMode(state) {
      state.dark = !state.dark;
    },
    getToken(state, payload) {
      state.token = payload;
    },
    setPlaylist(state, payload) {
      state.playlists = payload;
    },
    setTracks(state, payload) {
      return (state.tracks = payload);
    },
    setLoading(state, payload) {
      return state.loading = payload
    }
  },
  actions: {
    getToken({ commit }) {
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      window.location.hash = "";

      // Set token
      let _token = hash.access_token;

      const authEndpoint = "https://accounts.spotify.com/authorize";

      // Replace with your app's client ID, redirect URI and desired scopes
      const clientId = "753819e3242f444aabc7cadacd11de5b";
      const redirectUri = "http://localhost:8080";
      const scopes = ["user-top-read"];

      // If there is no token, redirect to Spotify authorization
      if (!_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`;
      }

      return commit("getToken", _token);
    },
    async getPlaylist({ commit, state }) {
      const url = "https://api.spotify.com/v1/me/playlists?limit=50";
      const options = {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      };
      const fetchPlaylist = await fetch(url, options);
      const response = await fetchPlaylist.json();
      const { items } = await response;
      const edit = items.map(item => {
        return { ...item, show: false };
      });

      return commit("setPlaylist", edit);
    },
    async getTrack({ commit, state }, url) {
      commit('setLoading', true)
      const options = {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      };
      const fetchTrack = await fetch(url, options);
      const response = await fetchTrack.json();
      const { items } = response;
      commit('setTracks', items)
      commit('setLoading', false)

    }
  },
  getters: {
    tracks(state) {
      return state.tracks;
    },
    loader(state) {
      return state.loading;
    }
  }
});
