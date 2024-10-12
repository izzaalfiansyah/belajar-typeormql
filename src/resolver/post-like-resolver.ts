import { Arg, Mutation, Resolver } from "type-graphql";
import { PostLikeInput } from "./args/post-like-args";
import { Repository } from "typeorm";
import { PostLike } from "../entity/post-like";
import { DB } from "../utils/db";
import { UserResolver } from "./user-resolver";
import { PostResolver } from "./post-resolver";
import { Post } from "../entity/post";
import { User } from "../entity/user";

@Resolver()
export class PostLikeResolver {
  constructor(
    public postLikeRepo: Repository<PostLike> = DB.getRepository(PostLike)
  ) {}

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

    const res = await this.postLikeRepo.save(postLike);

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async unLikePost(@Arg("id") id: number): Promise<boolean> {
    const postLike = await this.postLikeRepo.findOneBy({ id });

    if (!postLike) {
      return false;
    }

    const res = await this.postLikeRepo.remove(postLike);

    return !!res;
  }
}
