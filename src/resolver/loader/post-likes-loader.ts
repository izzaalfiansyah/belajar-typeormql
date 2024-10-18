import DataLoader from "dataloader";
import { PostLike } from "../../entity/post-like";

export const postLikesLoaderByUserId = new DataLoader(
  async (userIds: readonly number[]) => {
    const postLikes = await PostLike.createQueryBuilder("like")
      .where("like.userId IN (:...userIds)", {
        userIds,
      })
      .getMany();

    return userIds.map((userId) =>
      postLikes.filter((postLike) => postLike.userId == userId)
    );
  }
);

export const postLikesLoaderByPostId = new DataLoader(
  async (ids: readonly number[]) => {
    const likes = await PostLike.createQueryBuilder("like")
      .where("like.postId IN (:...postIds)", {
        postIds: ids,
      })
      .getMany();

    return ids.map((id) => likes.filter((like) => like.postId == id));
  }
);
