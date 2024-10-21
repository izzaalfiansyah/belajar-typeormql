<script lang="ts" setup>
import { ref } from "vue";

const name = ref("World");
</script>

<template>
  <v-app>
    <center>
      <v-text-field v-model="name" label="Name"></v-text-field>
      Hello {{ name }}!
    </center>
  </v-app>
</template>
