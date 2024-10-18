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
import { UserInput, UserArgs } from "./args/user-args";
import { Post } from "../entity/post";
import { PostLike } from "../entity/post-like";
import { PostComment } from "../entity/post-comment";
import { postsLoaderByUserId } from "./loader/post-loader";
import { postLikesLoaderByUserId } from "./loader/post-likes-loader";
import { postCommentsLoaderByUserId } from "./loader/post-comments-loader";

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
  async user(@Arg("id") id: number, @Root() post: Post): Promise<User | null> {
    const user = await User.findOne({
      where: { id },
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  async registerUser(@Arg("input") props: UserInput): Promise<boolean> {
    const user = await User.save({
      name: props.name,
      email: props.email,
      password: props.password,
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

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    const res = await User.delete({
      id,
    });

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
