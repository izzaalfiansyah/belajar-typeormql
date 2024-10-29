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
    setPosts(state, posts: Post[]) {
      state.posts = posts;
    },
    postAdded(state, post: Post) {
      state.posts = [post, ...state.posts];
      console.log(state.posts);
    },
  },
};
