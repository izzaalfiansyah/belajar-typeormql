import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolver/user-resolver";
import { PostResolver } from "../resolver/post-resolver";
import { PostLikeResolver } from "../resolver/post-like-resolver";
import { PostCommentResolver } from "../resolver/post-comment-resolver";
import { AuthResolver } from "../resolver/auth-resolver";
import { createPubSub } from "@graphql-yoga/subscription";

export const pubSub = createPubSub();

export const getSchema = async () => {
  return await buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      PostLikeResolver,
      PostCommentResolver,
      AuthResolver,
    ],
    pubSub: pubSub,
    authChecker: async ({ context: { user } }) => {
      if (!user) {
        return false;
      }

      return true;
    },
  });
};
