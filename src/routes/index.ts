import Vue from "vue";
import VueRouter, { type RouteConfig } from "vue-router";

import Login from "../pages/login/index.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/login",
    component: Login,
  },
];

export const router = new VueRouter({
  routes,
});
