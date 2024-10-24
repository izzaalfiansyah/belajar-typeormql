<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import { ref } from "vue";
import { router } from "../../plugins/routes";
import { Token } from "../../utils/token";

const req = ref<{
  email: string;
  password: string;
}>({
  email: "",
  password: "",
});

const showPassword = ref(false);
const toggleShowPassword = () => (showPassword.value = !showPassword.value);

const LOGIN_QUERY = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password })
  }
`;

const { mutate: loginMutation } = useMutation(LOGIN_QUERY, {
  variables: {
    email: req.value.email,
    password: req.value.password,
  },
});

async function handleLogin() {
  const res = await loginMutation({
    email: req.value.email,
    password: req.value.password,
  });

  const token = res?.data.login;

  if (!!token) {
    alert("Successfully logged in");
    console.log(token);
    Token.set(token);

    router.replace("/");
  } else {
    alert("Email or password wrong");
  }
}
</script>

<template>
  <v-app>
    <div
      class="un:min-h-screen un:font-inter un:antialiased un:text-base un:flex un:items-stretch un:flex-row"
    >
      <div
        class="un:flex un:w-full un:items-center un:justify-center lg:un:p-20 un:p-8"
      >
        <v-form @submit.prevent="handleLogin" class="lg:un:w-400px un:w-full">
          <div class="un:mb-10">
            <div class="un:text-2xl un:font-semibold">Welcome back!</div>
            <p class="un:text-gray un:text-sm">
              Log in to your account and start your adventure.
            </p>
          </div>
          <div class="un:mb-5">
            <v-text-field
              label="Email"
              placeholder="Enter Email"
              filled
              v-model="req.email"
            ></v-text-field>
            <v-text-field
              label="Password"
              placeholder="Enter Password"
              filled
              v-model="req.password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template v-slot:append>
                <button
                  type="button"
                  class="i-mdi:eye un:size-5"
                  :class="{ 'i-mdi:eye-off': !showPassword }"
                  @click="toggleShowPassword"
                ></button>
              </template>
            </v-text-field>
          </div>
          <v-btn class="un:w-full" type="submit" color="primary">Login</v-btn>
        </v-form>
      </div>
    </div>
  </v-app>
</template>
