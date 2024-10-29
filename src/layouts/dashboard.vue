<script lang="ts" setup>
import ProfileCard from "../components/profile-card.vue";
import AddPostButton from "../components/add-post-button.vue";
</script>

<template>
  <div class="un:min-h-screen un:font-inter un:antialiased un:text-base">
    <div
      class="un:sticky un:top-0 un:left-0 un:z-100 un:bg-white un:w-full un:border-b-solid un:border-gray-200 un:py-5 un:px-3"
    >
      <v-container>
        <v-row justify="space-between" align="center">
          <v-app-bar-title class="un:font-semibold primary--text"
            >JUSTPOSTS</v-app-bar-title
          >
          <AddPostButton></AddPostButton>
        </v-row>
      </v-container>
    </div>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <slot></slot>
          </v-col>
          <v-col lg="4">
            <ProfileCard></ProfileCard>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
