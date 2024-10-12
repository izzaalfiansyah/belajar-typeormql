import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { PostLikeInput } from "./args/post-like-args";
import { PostLike } from "../entity/post-like";
import { Post } from "../entity/post";
import { User } from "../entity/user";
import DataLoader from "dataloader";

const userLoader = new DataLoader(async (userIds: readonly number[]) => {
  const users = await User.createQueryBuilder("user")
    .where("user.id IN (:...userIds)", {
      userIds,
    })
    .getMany();

  return userIds.map((userId) => users.find((user) => user.id == userId));
});

const postLoader = new DataLoader(async (postIds: readonly number[]) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.id IN (:...postIds)", {
      postIds,
    })
    .getMany();

  return postIds.map((postId) => posts.find((post) => post.id == postId));
});

@Resolver(() => PostLike)
export class PostLikeResolver {
  @Mutation((returns) => Boolean)
  async likePost(@Arg("likeInput") props: PostLikeInput): Promise<boolean> {
    const user = await User.findOneBy({ id: props.userId });
    const post = await Post.findOneBy({ id: props.postId });

    if (!user || !post) {
      return false;
    }

    const postLike = new PostLike();
    postLike.user = user;
    postLike.post = post;

    const res = await PostLike.save(postLike);

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
}
