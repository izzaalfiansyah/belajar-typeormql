<script lang="ts" setup>
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";

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
</script>

<template>
  <div>
    <v-card
      v-for="post in result?.posts"
      elevation="0"
      class="un:border-solid !un:border-gray-200 un:mb-3"
    >
      <v-card-title class="mb-3">{{ post.user?.name }}</v-card-title>
      <v-card-text>
        {{ post.content }}
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn sm color="primary" class="un:w-full" text>LIKE</v-btn>
          </v-col>
          <v-col>
            <v-btn sm class="un:w-full" text>COMMENT</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>
