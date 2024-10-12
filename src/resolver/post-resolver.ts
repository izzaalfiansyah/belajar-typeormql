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
import { Repository } from "typeorm";
import { DB } from "../utils/db";
import { UserResolver } from "./user-resolver";
import { User } from "../entity/user";

@Resolver(() => Post)
export class PostResolver {
  constructor(public postRepo: Repository<Post> = DB.getRepository(Post)) {}

  @Query((returns) => [Post])
  async posts(@Args() args: PostArgs): Promise<Post[]> {
    let where: PostArgs = {};
    where.isPublished = args.isPublished;
    where.userId = args.userId;

    const posts = await this.postRepo.find({
      where,
      relations: ["likes"],
    });

    return posts;
  }

  @Query((returns) => Post)
  async post(@Arg("id") id: number): Promise<Post | null> {
    const post = await this.postRepo.findOne({
      where: {
        id,
      },
      relations: ["likes"],
    });

    return post;
  }

  @Mutation((returns) => Boolean)
  async createPost(@Arg("postInput") props: PostInput): Promise<boolean> {
    const userResolver = new UserResolver();
    const user = await userResolver.userRepo.findOneBy({ id: props.userId });

    if (!user) {
      return false;
    }

    const post = await this.postRepo.save({
      ...props,
      user: user,
    });

    return !!post;
  }

  @Mutation((returns) => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    const res = this.postRepo.delete({ id });

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async publishPost(@Arg("id") id: number): Promise<boolean> {
    const res = this.postRepo.update(
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
    const res = this.postRepo.update(
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
  async user(@Root() post: Post): Promise<User> {
    const user = await User.findOneBy({
      id: post.userId,
    });

    return user!;
  }
}
