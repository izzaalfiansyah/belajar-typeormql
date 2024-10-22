<script lang="ts" setup>
import { gql } from "@apollo/client/core";
import { useQuery } from "@vue/apollo-composable";
import { watch } from "vue";

const GET_USERS = gql`
  query getUsers {
    users {
      name
    }
  }
`;

const { result } = useQuery(GET_USERS);

watch(result, (res) => {
  console.log(res);
});
</script>

<template>
  <router-view></router-view>
</template>
