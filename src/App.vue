<script setup lang="ts">
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { apolloClient } from "./plugins/apollo";
import { gql } from "@apollo/client/core";
import { watch } from "vue";
import { store } from "./plugins/store";
import { router } from "./plugins/routes";

provideApolloClient(apolloClient);

const ME_QUERY = gql`
  query Me {
    profile {
      id
      name
      email
      isVerified
    }
  }
`;

const { result, onError } = useQuery(ME_QUERY);

watch(result, (res) => {
  if (!!res.profile) {
    store.commit("setUser", res.profile);
  }
});

onError((_) => {
  router.replace("/login");
});
</script>

<template>
  <router-view></router-view>
</template>
