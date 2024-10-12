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
import DataLoader from "dataloader";
import { PostLike } from "../entity/post-like";

const postLoader = new DataLoader(async (ids: readonly number[]) => {
  const posts = await Post.createQueryBuilder("post")
    .where("post.userId IN (:...ids)", {
      ids,
    })
    .getMany();
  return ids.map((id) => posts.filter((post) => post.userId == id));
});

const postLikesLoader = new DataLoader(async (ids: readonly number[]) => {
  const postLikes = await PostLike.createQueryBuilder("like")
    .where("like.userId IN (:...ids)", {
      ids,
    })
    .getMany();

  return ids.map((id) => postLikes.filter((postLike) => postLike.userId == id));
});

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
  async createUser(@Arg("userInput") props: UserInput): Promise<boolean> {
    const user = await User.save({
      name: props.name,
      email: props.email,
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
    return postLoader.load(user.id);
  }

  @FieldResolver(() => [PostLike])
  async postLikes(@Root() user: User): Promise<PostLike[]> {
    return postLikesLoader.load(user.id);
  }
}
