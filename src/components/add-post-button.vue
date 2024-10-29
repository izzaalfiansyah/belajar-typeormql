<script lang="ts" setup>
import { gql } from "@apollo/client/core";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import { store } from "../plugins/store";

const showModal = ref(false);
const content = ref<string>("");

const ADD_POST_QUERY = gql`
  mutation addPost($content: String!, $userId: ID!) {
    createPost(
      input: {
        title: "Ex Title"
        content: $content
        userId: $userId
        isPublished: true
      }
    )
  }
`;

const { mutate } = useMutation(ADD_POST_QUERY);

async function addPost() {
  const res = await mutate({
    content: content.value,
    userId: store.state.auth.user.id,
  });

  if (res?.data?.createPost) {
    alert("Successfully created post!");
    content.value = "";
    showModal.value = false;
  }
}
</script>

<template>
  <div>
    <v-btn icon color="primary" @click="showModal = true">
      <v-icon>i-mdi:plus</v-icon>
    </v-btn>

    <v-dialog v-model="showModal" width="500px">
      <v-form @submit.prevent="addPost">
        <v-card>
          <v-card-title>Add New Post</v-card-title>
          <v-card-text>
            <v-text-field
              label="Content"
              placeholder="Enter Your Content"
              filled
              v-model="content"
            ></v-text-field>
            <v-btn type="submit" class="un:w-full" color="primary"
              >Publish</v-btn
            >
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
