<script setup lang="ts">
import { store } from "../plugins/store";
import { User } from "../types/user";
import { userNameProfile } from "../utils/userNameProfile";

const user: User = store.state.auth.user;

function handleLogout() {
  const ok = confirm("Are you sure to logout?");

  if (ok) {
    store.commit("logout");
  }
}
</script>

<template>
  <v-card elevation="0" class="!un:border-solid !un:border-gray-200">
    <div class="un:py-5">
      <v-card-text>
        <div class="un:mb-5 un:flex un:items-center un:justify-center">
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
        <div class="un:mt-5 un:text-center">
          <v-btn text @click="handleLogout">
            <v-icon>i-mdi:logout</v-icon>
            Logout
          </v-btn>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>
