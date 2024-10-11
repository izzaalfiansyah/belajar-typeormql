import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchemaSync } from "type-graphql";
import { UserResolver } from "../resolver/user-resolver";

const schema = buildSchemaSync({
  resolvers: [UserResolver],
});

export const typeGraphQLRouter = Router();

typeGraphQLRouter.post(
  "/typegraphql",
  createHandler({
    schema,
  })
);
