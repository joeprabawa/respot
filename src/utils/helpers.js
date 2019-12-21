import db from "@/nedb";
export const reducing = data => {
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
