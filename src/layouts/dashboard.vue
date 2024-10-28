<template>
  <div class="un:min-h-screen un:font-inter un:antialiased un:text-base">
    <div
      class="un:sticky un:top-0 un:left-0 un:z-100 un:bg-white un:w-full un:border-b-solid un:border-gray-100 un:py-4 un:px-3"
    >
      <v-container>
        <v-row justify="space-between" align="center">
          <v-app-bar-title class="un:font-semibold">JUSTPOSTS</v-app-bar-title>
          <div class="un:bg-gray-200 un:rounded-full un:size-12"></div>
        </v-row>
      </v-container>
    </div>
    <v-main>
      <v-container>
        <slot></slot>
      </v-container>
    </v-main>
  </div>
</template>
