import Vue from "vue";
import VueRouter, { type RouteConfig } from "vue-router";

import Index from "../pages/index.vue";
import Login from "../pages/login/index.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Index,
  },
  {
    path: "/login",
    component: Login,
  },
];

export const router = new VueRouter({
  routes,
});
