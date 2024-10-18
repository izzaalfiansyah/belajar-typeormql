import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { PostComment } from "../entity/post-comment";
import { Post } from "../entity/post";
import DataLoader from "dataloader";
import { PostCommentInput } from "./args/post-comment-args";
import { User } from "../entity/user";
import { postLoader } from "./loader/post-loader";
import { userLoader } from "./loader/user-loader";
import { AppContext } from "../types/app-context";

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
  @Mutation(() => Boolean)
  async commentPost(
    @Arg("input") input: PostCommentInput,
    @Ctx() ctx: AppContext
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

    if (!!postComment) {
      ctx.pubSub.publish("POST_COMMENTED", postComment);
    }

    return !!postComment;
  }

  @Mutation(() => Boolean)
  async unCommentPost(@Arg("id") id: number) {
    const res = await PostComment.delete({
      id,
    });

    return !!res.affected;
  }

  @FieldResolver(() => Post)
  async post(@Root() comment: PostComment): Promise<Post | undefined> {
    return postLoader.load(comment.postId as any);
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

  @Subscription(() => PostComment, {
    topics: "POST_COMMENTED",
  })
  async postCommented(@Root() comment: PostComment) {
    return Comment;
  }
}
