<script setup lang="ts">
import { provideApolloClient } from "@vue/apollo-composable";
import { apolloClient } from "./plugins/apollo";
import { onMounted } from "vue";
import { store } from "./plugins/store";
import { router } from "./plugins/routes";
import Dashboard from "./layouts/dashboard.vue";

provideApolloClient(apolloClient);

function isAuthPath(): boolean {
  const path = router.currentRoute.fullPath;
  return path.includes("login") || path.includes("register");
}

function checkUser() {
  const user = store.state.auth.user;

  if (!user && !isAuthPath()) {
    router.replace("/login");
  }

  if (!!user && isAuthPath()) {
    router.replace("/");
  }
}

onMounted(() => {
  store.commit("checkUser", () => {
    checkUser();
  });
});
</script>

<template>
  <v-app>
    <Dashboard v-if="$store.state.auth.user">
      <router-view></router-view>
    </Dashboard>
    <template v-else>
      <router-view></router-view>
    </template>
  </v-app>
</template>
