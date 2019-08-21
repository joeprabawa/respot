import Vue from "vue";
import Router from "vue-router";
import BookMarks from "./views/Bookmarks.vue";
// import Export from "./views/Export.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Home.vue")
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
