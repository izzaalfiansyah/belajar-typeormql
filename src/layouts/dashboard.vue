<script lang="ts" setup>
import { store } from "../plugins/store";
import { User } from "../types/user";
import { userNameProfile } from "../utils/userNameProfile";

const user: User = store.state.auth.user;
</script>

<template>
  <div class="un:min-h-screen un:font-inter un:antialiased un:text-base">
    <div
      class="un:sticky un:top-0 un:left-0 un:z-100 un:bg-white un:w-full un:border-b-solid un:border-gray-100 un:py-4 un:px-3"
    >
      <v-container>
        <v-row justify="space-between" align="center">
          <v-app-bar-title class="un:font-semibold">JUSTPOSTS</v-app-bar-title>
          <div>
            <v-btn icon color="primary">
              <v-icon>i-mdi:plus</v-icon>
            </v-btn>
          </div>
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
            <v-card elevation="0" class="!un:border-solid !un:border-gray-200">
              <div class="un:py-10">
                <v-card-text>
                  <div
                    class="un:mb-5 un:flex un:items-center un:justify-center"
                  >
                    <div
                      class="un:border-solid un:border-gray-200 un:size-24 un:rounded-full un:flex un:items-center un:justify-center"
                    >
                      <div class="un:font-semibold un:text-xl">
                        {{ userNameProfile(user.name) }}
                      </div>
                    </div>
                  </div>
                  <div class="un:text-center">
                    <div class="un:font-semibold">
                      {{ user.email }}
                    </div>
                    <div class="un:text-sm">{{ user.name }}</div>
                  </div>
                </v-card-text>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
