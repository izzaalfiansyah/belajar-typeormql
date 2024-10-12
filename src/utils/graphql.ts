import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolver/user-resolver";
import { PostResolver } from "../resolver/post-resolver";
import { PostLikeResolver } from "../resolver/post-like-resolver";

export const getSchema = async () => {
  return await buildSchema({
    resolvers: [UserResolver, PostResolver, PostLikeResolver],
  });
};