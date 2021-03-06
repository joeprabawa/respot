import db from "@/nedb";
import axios from "axios";
import { setupCache } from "axios-cache-adapter";
const cache = setupCache({
  maxAge: 15 * 60 * 1000
});
const reducing = data => {
  return data.reduce((acc, v) => {
    const key = v.category.toLowerCase().replace(/\s/g, "");
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});
};

export const categorized = async () => {
  const reduced = await db.find({});
  const data = reducing(reduced);
  return data;
};

export const datatable = {
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
  ],
  option: [14, 25, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }]
};

export const api = axios.create({
  adapter: cache.adapter
});

// return params
//   .map(a => [Math.random(), a])
//   .sort((a, b) => a[0] - b[0])
//   .map(a => a[1])
//   .slice(0, n);
