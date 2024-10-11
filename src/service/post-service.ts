import { Post } from "../entity/post";
import { DB } from "../utils/db";
import { userRepo } from "./user-service";

export const postSchema = `
type Post {
    id: ID
    title: String
    content: String
    isPublished: Boolean
    user: User
}
`;

export const postQuery = `
    posts(userId: ID, isPublished: Boolean): [Post]
    post(id: ID!): Post
`;

export const postMutation = `
    createPost(title: String!, content: String!, isPublished: Boolean, userId: ID!): Boolean
    publishPost(id: ID!): Boolean
    unPublishPost(id: ID!): Boolean
    deletePost(id: ID!): Boolean
`;

export const postRepo = DB.getRepository(Post);

export const postServices = {
  async posts(props: { userId?: number; isPublished?: boolean }) {
    let where: any = {};

    if (props.userId != null) {
      where.userId = props.userId;
    }

    if (props.isPublished != null) {
      where.isPublished = props.isPublished;
    }

    const posts = await postRepo.find({
      where,
      relations: ["user"],
    });

    return posts;
  },
  async post(props: { id: number }) {
    const post = await postRepo.findOne({
      where: { id: props.id },
      relations: ["user"],
    });

    return post;
  },
  async createPost(
    props: Post & {
      userId: number;
    }
  ) {
    try {
      const user = await userRepo.findOneBy({ id: props.userId });

      const post = await postRepo.save({
        title: props.title,
        content: props.content,
        isPublished: props.isPublished,
        user: user!,
      });

      return !!post;
    } catch (err) {
      return false;
    }
  },
  async publishPost(props: { id: number }) {
    try {
      const post = await postRepo.findOneBy({
        id: props.id,
      });

      post!.isPublished = true;

      return !!post;
    } catch (err) {
      return false;
    }
  },
  async unPublishPost(props: { id: number }) {
    try {
      const post = await postRepo.findOneBy({
        id: props.id,
      });

      post!.isPublished = false;

      return !!post;
    } catch (err) {
      return false;
    }
  },
  async deletePost(props: { id: number }) {
    const res = await postRepo.delete({
      id: props.id,
    });

    return !!res.affected;
  },
};
