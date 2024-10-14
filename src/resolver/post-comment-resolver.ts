import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { PostComment } from "../entity/post-comment";
import { Post } from "../entity/post";
import DataLoader from "dataloader";
import { PostCommentInput } from "./args/post-comment-args";
import { DB } from "../utils/db";
import { User } from "../entity/user";

const postLoader = new DataLoader(async (postIds) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.id IN (:...postIds)", { postIds })
    .getMany();

  return postIds.map((postId) => posts.find((post) => post.id == postId));
});

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.createQueryBuilder("user")
    .where("user.id IN (:...userIds)", { userIds })
    .getMany();

  return userIds.map((userId) => users.find((user) => user.id == userId));
});

const childrenLoader = new DataLoader(async (parentIds) => {
  const comments = await PostComment.createQueryBuilder("comment")
    .where("comment.parentId IN (:...parentIds)", { parentIds })
    .getMany();

  return parentIds.map((parentId) =>
    comments.filter((comment) => comment.parentId == parentId)
  );
});

const parentLoader = new DataLoader(async (parentIds) => {
  const comments = await PostComment.createQueryBuilder("comment")
    .where("comment.id IN (:...parentIds)", { parentIds })
    .getMany();

  return parentIds.map((parentId) =>
    comments.find((comment) => comment.id == parentId)
  );
});

@Resolver(() => PostComment)
export class PostCommentResolver {
  @Query(() => [PostComment])
  async postComments(): Promise<PostComment[]> {
    // const postComments = await DB.manager
    //   .getTreeRepository(PostComment)
    //   .findTrees();

    const postComments = await DB.manager
      .getTreeRepository(PostComment)
      .findRoots();

    return postComments;
  }

  @Mutation(() => Boolean)
  async createPostComment(
    @Arg("input") input: PostCommentInput
  ): Promise<boolean> {
    const post = await Post.createQueryBuilder("post")
      .where("post.id = :id", { id: input.postId })
      .getOne();

    const parent = await PostComment.createQueryBuilder("comment")
      .where("comment.id = :id", {
        id: input.parentId,
      })
      .getOne();

    if (!parent && !post) {
      return false;
    }

    const postComment = await PostComment.save({
      ...input,
      parent: parent!,
      post: post!,
    });

    return !!postComment;
  }

  @Mutation(() => Boolean)
  async deletePostComment(@Arg("id") id: number) {
    const res = await PostComment.delete({
      id,
    });

    return !!res.affected;
  }

  @FieldResolver(() => Post)
  async post(@Root() comment: PostComment): Promise<Post | undefined> {
    return postLoader.load(comment.postId);
  }

  @FieldResolver(() => User)
  async user(@Root() comment: PostComment): Promise<User> {
    return userLoader.load(comment.userId) as Promise<User>;
  }

  @FieldResolver(() => [PostComment])
  async children(@Root() comment: PostComment): Promise<PostComment[]> {
    return childrenLoader.load(comment.id);
  }

  @FieldResolver(() => PostComment, { nullable: true })
  async parent(@Root() comment: PostComment): Promise<PostComment | undefined> {
    return parentLoader.load(comment.parentId);
  }
}
