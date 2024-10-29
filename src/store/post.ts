import { Module } from "vuex";
import { Post } from "../types/post";

export const postStore: Module<
  {
    posts: Post[];
  },
  unknown
> = {
  state() {
    const posts = [] as Post[];

    return {
      posts,
    };
  },
  mutations: {
    setPosts(state, data: Post[]) {
      state.posts = data;
    },
  },
};
