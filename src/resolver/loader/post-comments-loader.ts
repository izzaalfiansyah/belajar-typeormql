import DataLoader from "dataloader";
import { PostComment } from "../../entity/post-comment";

export const postCommentsLoaderByUserId = new DataLoader(async (userIds) => {
  const postComments = await PostComment.createQueryBuilder("comment")
    .where("comment.userId IN (:...userIds)", { userIds })
    .getMany();

  return userIds.map((userId) =>
    postComments.filter((comment) => comment.userId == userId)
  );
});

export const postCommentsLoaderByPostId = new DataLoader(async (ids) => {
  const comments = await PostComment.createQueryBuilder("comment")
    .where("comment.postId IN (:...postIds)", {
      postIds: ids,
    })
    .getMany();

  return ids.map((id) => comments.filter((comment) => comment.postId == id));
});
