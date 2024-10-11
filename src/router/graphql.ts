import express from "express";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import {
  userMutation,
  userQuery,
  userSchema,
  userServices,
} from "../service/user-service";
import {
  postMutation,
  postQuery,
  postSchema,
  postServices,
} from "../service/post-service";

export const graphQLRouter = express.Router();

const schema = buildSchema(`
    ${userSchema}
    ${postSchema}
    
    type Query {
        ${userQuery}
        ${postQuery}
    }

    type Mutation {
        ${userMutation}
        ${postMutation}
    }
`);

const rootValue = {
  ...userServices,
  ...postServices,
};

graphQLRouter.post(
  "/graphql",
  createHandler({
    schema,
    rootValue,
  })
);
