import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Post } from "../entity/post";
import { PostArgs, PostInput } from "./args/post-args";
import { User } from "../entity/user";
import DataLoader from "dataloader";
import { PostLike } from "../entity/post-like";
import { PostComment } from "../entity/post-comment";
import { DB } from "../utils/db";

const userLoader = new DataLoader(async (userIds: readonly number[]) => {
  const users = await User.createQueryBuilder("user")
    .where("user.id IN (:...ids)", {
      ids: userIds,
    })
    .getMany();

  return userIds.map((id) => users.find((user) => user.id == id));
});

const likeLoader = new DataLoader(async (ids: readonly number[]) => {
  const likes = await PostLike.createQueryBuilder("like")
    .where("like.postId IN (:...postIds)", {
      postIds: ids,
    })
    .getMany();

  return ids.map((id) => likes.filter((like) => like.postId == id));
});

const commentLoader = new DataLoader(async (ids) => {
  const comments = await PostComment.createQueryBuilder("comment")
    .where("comment.postId IN (:...postIds)", {
      postIds: ids,
    })
    .getMany();

  return ids.map((id) => comments.filter((comment) => comment.postId == id));
});

@Resolver(() => Post)
export class PostResolver {
  @Query((returns) => [Post])
  async posts(@Args() args: PostArgs): Promise<Post[]> {
    let where: PostArgs = {};
    where.isPublished = args.isPublished;
    where.userId = args.userId;

    const posts = await Post.find({
      where,
    });

    return posts;
  }

  @Query((returns) => Post)
  async post(@Arg("id") id: number): Promise<Post | null> {
    const post = await Post.findOne({
      where: {
        id,
      },
    });

    return post;
  }

  @Mutation((returns) => Boolean)
  async createPost(@Arg("postInput") props: PostInput): Promise<boolean> {
    const user = await User.findOneBy({ id: props.userId });

    if (!user) {
      return false;
    }

    const post = await Post.save({
      ...props,
      user: user,
    });

    return !!post;
  }

  @Mutation((returns) => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    const res = Post.delete({ id });

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

    return !!res;
  }

  @FieldResolver(() => User)
  async user(@Root() post: Post): Promise<User | undefined> {
    return userLoader.load(post.userId);
  }

  @FieldResolver(() => [PostLike])
  async likes(@Root() post: Post): Promise<PostLike[]> {
    return likeLoader.load(post.id);
  }

  @FieldResolver(() => [PostComment])
  async comments(@Root() post: Post): Promise<PostComment[]> {
    return commentLoader.load(post.id);
  }
}
