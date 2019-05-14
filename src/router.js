import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import BookMarks from "./views/Bookmarks.vue";
// import Export from "./views/Export.vue";

Vue.use(Router);

export default new Router({
  mode: "history",

  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/bookmarks",
      name: "bookmarks",
      component: BookMarks
    },
    {
      path: "/export",
      name: "export",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Export.vue")
    }
  ]
});
