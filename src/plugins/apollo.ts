import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { Token } from "../utils/token";

const httpLink = () => {
  let headers: { [key: string]: string } = {};

  const token = Token.get();
  if (!!token) {
    headers["Authorization"] = token;
  }

  return createHttpLink({
    uri: "http://localhost:4000/graphql",
    headers,
  });
};

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: httpLink(),
  cache,
});
