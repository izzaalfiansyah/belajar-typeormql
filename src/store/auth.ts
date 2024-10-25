import { Module } from "vuex";
import { User } from "../types/user";
import { gql } from "@apollo/client/core";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { Token } from "../utils/token";

export const authStore: Module<
  {
    user: User | null;
  },
  unknown
> = {
  state: () => ({
    user: null,
  }),
  mutations: {
    async checkUser(state, callback) {
      const PROFILE_QUERY = gql`
        query getProfile {
          profile {
            id
            name
            email
            isVerified
          }
        }
      `;

      try {
        const { result, refetch } = useQuery(PROFILE_QUERY);

        if (!result.value) {
          await refetch();
        }

        state.user = result.value.profile;
      } catch (err) {
        // console.log(err);
      }
      callback(state.user);
    },
    async login(
      _,
      params: {
        email: string;
        password: string;
      }
    ) {
      const LOGIN_QUERY = gql`
        mutation login($email: String!, $password: String!) {
          login(input: { email: $email, password: $password })
        }
      `;

      const { mutate } = useMutation(LOGIN_QUERY);
      const res = await mutate(params);

      const token = res?.data.login;

      if (!!token) {
        await Token.set(token);
        window.location.reload();
      }
    },
  },
};
