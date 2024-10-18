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
import { PostLike } from "../entity/post-like";
import { PostComment } from "../entity/post-comment";
import { userLoader } from "./loader/user-loader";
import { postLikesLoaderByPostId } from "./loader/post-likes-loader";
import { postCommentsLoaderByPostId } from "./loader/post-comments-loader";

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
    return postLikesLoaderByPostId.load(post.id);
  }

  @FieldResolver(() => [PostComment])
  async comments(@Root() post: Post): Promise<PostComment[]> {
    return postCommentsLoaderByPostId.load(post.id);
  }
}
