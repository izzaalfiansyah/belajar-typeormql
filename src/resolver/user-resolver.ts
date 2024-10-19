import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../entity/user";
import { UserInput, UserArgs, UserInputWithPassword } from "./args/user-args";
import { Post } from "../entity/post";
import { PostLike } from "../entity/post-like";
import { PostComment } from "../entity/post-comment";
import { postsLoaderByUserId } from "./loader/post-loader";
import { postLikesLoaderByUserId } from "./loader/post-likes-loader";
import { postCommentsLoaderByUserId } from "./loader/post-comments-loader";
import { sendEmailToUserQueue } from "../queue/user-queue";
import bcrypt from "bcrypt";
import { redis } from "../utils/redis";
import CACHE from "../types/redis-types";

@Resolver(() => User)
export class UserResolver {
  @Query((returns) => [User])
  async users(@Args() props: UserArgs): Promise<User[]> {
    let where: any = {};

    if (props.isVerified != null) {
      where.isVerified = props.isVerified;
    }

    const users = await User.find({
      where,
    });

    return users;
  }

  @Query((returns) => User)
  async user(@Arg("id") id: number): Promise<User | null> {
    const userCache = await redis.get(CACHE.USER(id));

    if (!!userCache) {
      return JSON.parse(userCache);
    }

    const user = await User.findOne({
      where: { id },
    });

    if (!!user) {
      await redis.set(CACHE.USER(id), JSON.stringify(user), "EX", 60 * 60);
    }

    return user;
  }

  @Mutation((returns) => Boolean)
  async registerUser(
    @Arg("input") input: UserInputWithPassword
  ): Promise<boolean> {
    const password = await bcrypt.hash(input.password, 12);

    const user = await User.save({
      name: input.name,
      email: input.email,
      password,
    });

    await sendEmailToUserQueue.add("sendEmailToUser", {
      ...user,
    });

    return !!user;
  }

  @Mutation((returns) => Boolean)
  async updateUser(
    @Arg("id") id: number,
    @Arg("userInput") props: UserInput
  ): Promise<boolean> {
    const user = await User.findOneBy({ id });

    if (!user) {
      return false;
    }

    user.name = props.name;
    user.email = props.email;

    const res = await User.save(user);

    await redis.set(CACHE.USER(id), JSON.stringify(user), "EX", 60 * 60);

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    const res = await User.delete({
      id,
    });

    await redis.del(CACHE.USER(id));

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async verifyUser(@Arg("id") id: number): Promise<boolean> {
    const user = await User.findOneBy({ id });

    if (!user) {
      return false;
    }

    user.isVerified = true;

    const res = await User.save(user);

    await redis.del(CACHE.USER(id));

    return !!res;
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User): Promise<Post[]> {
    return postsLoaderByUserId.load(user.id);
  }

  @FieldResolver(() => [PostLike])
  async postLikes(@Root() user: User): Promise<PostLike[]> {
    return postLikesLoaderByUserId.load(user.id);
  }

  @FieldResolver(() => [PostComment])
  async postComments(@Root() user: User): Promise<PostComment[]> {
    return postCommentsLoaderByUserId.load(user.id);
  }
}
