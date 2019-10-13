import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    playlists: [],
    tracks: [],
    indo: null,
    studio: [],
    dark: true,
    loading: false,
    trackLoading: false,
    next: false
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
      return (state.loading = payload);
    },
    setNextLoading(state, payload) {
      return (state.nextLoading = payload);
    },
    setNext(state, payload) {
      return state.playlists.push(payload);
    },
    next(state, payload) {
      return (state.next = payload);
    },
    trackLoading(state, payload) {
      return (state.trackLoading = payload);
    },
    changeIndo(state, payload) {
      return (state.indo = payload);
    },
    storeToStudio(state, payload) {
      return state.studio.push(payload);
    }
  },
  actions: {
    getToken({ commit }) {
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
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
      commit("setLoading", true);
      const url = "https://api.spotify.com/v1/me/playlists?limit=8";
      const options = {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      };
      const fetchPlaylist = await fetch(url, options);
      const response = await fetchPlaylist.json();
      const { items, next } = await response;
      const edit = items.map(item => {
        return { ...item, show: false };
      });

      await commit("next", next);
      await commit("setPlaylist", edit);
      return commit("setLoading", false);
    },

    async getTrack({ commit, state }, payload) {
      commit("setTracks", []);
      commit("trackLoading", true);
      const options = {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      };
      const url = `https://api.spotify.com/v1/playlists/${payload}/tracks`;
      const fetchTrack = await fetch(url, options);
      const response = await fetchTrack.json();
      const { items } = response;

      const editedTracks = items.map(async item => {
        const { id } = item.track;
        const url = `https://api.spotify.com/v1/audio-features/${id}`;
        const fetchAudio = await fetch(url, options);
        const { tempo, energy, mode, key } = await fetchAudio.json();

        const final = `${Math.round(tempo)} BPM`;
        const markIndo = state.indo === payload ? "Indonesia" : "";

        return {
          ...item,
          mode,
          key,
          tempo: final,
          mark: energy,
          category: markIndo,
          alt:
            "https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png"
        };
      });
      await Promise.all(editedTracks).then(result => {
        commit("setTracks", result);
      });
      commit("trackLoading", false);
    },

    async nextPlaylist({ commit, state }) {
      const options = {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      };
      const fetchTrack = await fetch(state.next, options);
      const response = await fetchTrack.json();
      const { items, next } = response;
      commit("next", next);
      items.forEach(item => commit("setNext", item));
    }
  },
  getters: {
    tracks(state) {
      const edited = state.tracks.map(track => {
        const { release_date } = track.track.album;
        let { mark, category } = track;

        // Set Category
        const getYear = parseInt(release_date.substring(0, 4));
        const today = new Date();
        const year = today.getFullYear();
        const substract = year - getYear;

        if (category === "Indonesia") {
          category = category;
        } else if (getYear === year) {
          category = "Top 40";
        } else if (substract === 1) {
          category = "Current";
        } else if (substract >= 2 && substract < 10) {
          category = "Recurrent";
        } else {
          category = "Oldies";
        }

        // // Set Remark
        const floor = Math.floor(mark * 10);

        let remark = "";
        if (floor >= 0 && floor <= 3) remark = "S";
        else if (floor >= 4 && floor <= 7) remark = "M";
        else if (floor === 8) remark = " M+";
        else remark = "B";
        return { ...track, category, remark };
      });

      return edited;
    },

    loader(state) {
      return state.loading;
    },

    trackLoading(state) {
      return state.trackLoading;
    },

    playlists(state) {
      return state.playlists.reduce((acc, current) => {
        const x = acc.find(item => {
          return item.id === current.id;
        });

        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    }
  }
});
