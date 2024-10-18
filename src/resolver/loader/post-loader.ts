import DataLoader from "dataloader";
import { Post } from "../../entity/post";

export const postLoader = new DataLoader(async (postIds: readonly number[]) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.id IN (:...postIds)", {
      postIds,
    })
    .getMany();

  return postIds.map((postId) => posts.find((post) => post.id == postId));
});

export const postsLoader = new DataLoader(async (ids) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.id IN (:...ids)", { ids })
    .getMany();

  return ids.map((id) => posts.filter((post) => post.id == id));
});

export const postsLoaderByUserId = new DataLoader(async (userIds) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.userId IN (:...userIds)", { userIds })
    .getMany();

  return userIds.map((userId) => posts.filter((post) => post.userId == userId));
});
