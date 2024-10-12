import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "../resolver/user-resolver";
import { PostResolver } from "../resolver/post-resolver";
import { PostLikeResolver } from "../resolver/post-like-resolver";

const schema = buildSchemaSync({
  resolvers: [UserResolver, PostResolver, PostLikeResolver],
});

export const typeGraphQLRouter = Router();

typeGraphQLRouter.post(
  "/typegraphql",
  createHandler({
    schema,
  })
);
