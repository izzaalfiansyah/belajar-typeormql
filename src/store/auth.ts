import { Module } from "vuex";
import { User } from "../types/user";

export const authStore: Module<
  {
    user: User | null;
  },
  unknown
> = {
  state: () => ({
    user: null,
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
};
