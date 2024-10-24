<script setup lang="ts">
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { apollo } from "./plugins/apollo";
import { gql } from "@apollo/client/core";
import { onMounted } from "vue";

provideApolloClient(apollo);

const ME_QUERY = gql`
  query Me {
    profile {
      name
      email
    }
  }
`;

const { result } = useQuery(ME_QUERY);

onMounted(() => {
  setTimeout(() => {
    console.log(result.value);
  }, 5000);
});
</script>

<template>
  <router-view></router-view>
</template>
