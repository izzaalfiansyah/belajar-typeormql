import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { PostLikeInput } from "./args/post-like-args";
import { PostLike } from "../entity/post-like";
import { Post } from "../entity/post";
import { User } from "../entity/user";
import { AppContext } from "../types/app-context";
import { userLoader } from "./loader/user-loader";
import { postLoader } from "./loader/post-loader";

@Resolver(() => PostLike)
export class PostLikeResolver {
  @Mutation((returns) => Boolean)
  async likePost(
    @Arg("likeInput") props: PostLikeInput,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    const user = await User.findOneBy({ id: props.userId });
    const post = await Post.findOneBy({ id: props.postId });

    if (!user || !post) {
      return false;
    }

    const postLike = new PostLike();
    postLike.user = user;
    postLike.post = post;

    const res = await PostLike.save(postLike);

    if (!!res) {
      await ctx.pubSub.publish("POST_LIKED", res);
    }

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async unLikePost(@Arg("id") id: number): Promise<boolean> {
    const postLike = await PostLike.findOneBy({ id });

    if (!postLike) {
      return false;
    }

    const res = await PostLike.remove(postLike);

    return !!res;
  }

  @FieldResolver(() => User)
  async user(@Root() like: PostLike): Promise<User | undefined> {
    return userLoader.load(like.userId);
  }

  @FieldResolver(() => Post)
  async post(@Root() like: PostLike): Promise<Post | undefined> {
    return postLoader.load(like.postId);
  }

  @Subscription(() => PostLike, {
    topics: "POST_LIKED",
  })
  async postLiked(@Root() postLike: PostLike): Promise<PostLike | undefined> {
    return postLike;
  }
}
