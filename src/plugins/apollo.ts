import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";

const link = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const cache = new InMemoryCache();

export const apollo = new ApolloClient({
  link,
  cache,
});
