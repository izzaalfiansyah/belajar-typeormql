<script lang="ts" setup>
import { gql } from "@apollo/client/core";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import { store } from "../plugins/store";

const showModal = ref(false);
const content = ref<string>("");
const form = ref();

const contentRules = [
  (v: any) => {
    if (!v) {
      return "Please enter your content!";
    }

    return true;
  },
];

const ADD_POST_MUTATION = gql`
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

const { mutate } = useMutation(ADD_POST_MUTATION);

async function addPost() {
  if (form.value.validate()) {
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
}
</script>

<template>
  <div>
    <v-btn icon color="primary" @click="showModal = true">
      <div class="i-mdi:plus un:size-6"></div>
    </v-btn>

    <v-dialog v-model="showModal" width="500px">
      <v-form @submit.prevent="addPost" ref="form">
        <v-card>
          <v-card-title>Add New Post</v-card-title>
          <v-card-text>
            <v-text-field
              label="Content"
              placeholder="Enter Your Content"
              filled
              v-model="content"
              :rules="contentRules"
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
