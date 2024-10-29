import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  ApolloLink,
} from "@apollo/client/core";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { Token } from "../utils/token";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = () => {
  return new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/graphql",
    })
  );
};

const httpLink = () => {
  let headers: { [key: string]: string } = {};

  const token = Token.get();
  if (!!token) {
    headers["Authorization"] = token;
  }

  return new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers,
  });
};

const cache = new InMemoryCache();
const splitLink = split(
  (res) => {
    const definition = getMainDefinition(res.query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink() as any,
  httpLink()
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
});
