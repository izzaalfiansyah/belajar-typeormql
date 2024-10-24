import Vue from "vue";
import Vuex from "vuex";
import { authStore } from "../store/auth";

Vue.use(Vuex);

export const store = new Vuex.Store<any>({
  modules: {
    auth: authStore,
  },
});
