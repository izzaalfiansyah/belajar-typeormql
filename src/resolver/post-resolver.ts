import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Post } from "../entity/post";
import { PostArgs, PostInput } from "./args/post-args";
import { User } from "../entity/user";
import { PostLike } from "../entity/post-like";
import { PostComment } from "../entity/post-comment";
import { userLoader } from "./loader/user-loader";
import { postLikesLoaderByPostId } from "./loader/post-likes-loader";
import { postCommentsLoaderByPostId } from "./loader/post-comments-loader";
import { redis } from "../utils/redis";
import CACHE from "../types/redis-types";
import { AppContext } from "../types/app-context";

@Resolver(() => Post)
export class PostResolver {
  @Query((returns) => [Post])
  async posts(@Args() args: PostArgs): Promise<Post[]> {
    let where: PostArgs = {};
    where.isPublished = args.isPublished;
    where.userId = args.userId;

    const posts = await Post.find({
      where,
      order: {
        id: "desc",
      },
    });

    return posts;
  }

  @Query((returns) => Post)
  async post(@Arg("id") id: number): Promise<Post | null> {
    const cachePost = await redis.get(CACHE.POST(id));

    if (!!cachePost) {
      return JSON.parse(cachePost);
    }

    const post = await Post.findOne({
      where: {
        id,
      },
    });

    await redis.set(CACHE.POST(id), JSON.stringify(post), "EX", 60 * 60);

    return post;
  }

  @Mutation((returns) => Boolean)
  async createPost(
    @Arg("input") props: PostInput,
    @Ctx() { pubSub }: AppContext
  ): Promise<boolean> {
    const user = await User.findOneBy({ id: props.userId });

    if (!user) {
      throw new Error("user not found");
    }

    const post = await Post.save({
      ...props,
      user: user,
    });

    pubSub.publish("POST_ADDED", post);

    return !!post;
  }

  @Mutation((returns) => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    const res = Post.delete({ id });

    await redis.del(CACHE.POST(id));

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async publishPost(@Arg("id") id: number): Promise<boolean> {
    const res = Post.update(
      {
        id,
      },
      {
        isPublished: true,
      }
    );

    await redis.del(CACHE.POST(id));

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async unPublishPost(@Arg("id") id: number): Promise<boolean> {
    const res = Post.update(
      {
        id,
      },
      {
        isPublished: false,
      }
    );

    await redis.del(CACHE.POST(id));

    return !!res;
  }

  @FieldResolver(() => User)
  async user(@Root() post: Post): Promise<User | undefined> {
    return userLoader.load(post.userId);
  }

  @FieldResolver(() => [PostLike])
  async likes(@Root() post: Post): Promise<PostLike[]> {
    return postLikesLoaderByPostId.load(post.id);
  }

  @FieldResolver(() => [PostComment])
  async comments(@Root() post: Post): Promise<PostComment[]> {
    return postCommentsLoaderByPostId.load(post.id);
  }

  @Subscription(() => Post, {
    topics: ["POST_ADDED"],
  })
  async postAdded(@Root() post: Post): Promise<Post> {
    return post;
  }
}
