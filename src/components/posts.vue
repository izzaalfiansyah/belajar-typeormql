<script lang="ts" setup>
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { watch } from "vue";
import { store } from "../plugins/store";

const GET_POST = gql`
  query getPosts {
    posts {
      user {
        name
      }
      title
      content
    }
  }
`;

const { result } = useQuery(GET_POST);

watch(result, () => {
  if (result.value?.posts) {
    store.state.post.posts = result.value.posts;
  }
});
</script>

<template>
  <div>
    <v-card
      v-for="post in $store.state.post.posts"
      elevation="0"
      class="un:border-solid !un:border-gray-200 un:mb-3"
    >
      <v-card-title class="mb-3">{{ post.user?.name }}</v-card-title>
      <v-card-text>
        {{ post.content }}
      </v-card-text>
      <!-- <v-card-actions>
        <v-row>
          <v-col>
            <v-btn sm color="primary" class="un:w-full" text>LIKE</v-btn>
          </v-col>
          <v-col>
            <v-btn sm class="un:w-full" text>COMMENT</v-btn>
          </v-col>
        </v-row>
      </v-card-actions> -->
    </v-card>
  </div>
</template>
