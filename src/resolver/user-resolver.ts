import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import { User } from "../entity/user";
import { UserInput, UserArgs } from "./args/user-args";
import { DB } from "../utils/db";
import { Post } from "../entity/post";

@Resolver(() => User)
export class UserResolver {
  constructor(public userRepo: Repository<User> = DB.getRepository(User)) {}

  @Query((returns) => [User])
  async users(@Args() props: UserArgs): Promise<User[]> {
    let where: any = {};

    if (props.isVerified != null) {
      where.isVerified = props.isVerified;
    }

    const users = await this.userRepo.find({
      where,
    });

    return users;
  }

  @Query((returns) => User)
  async user(@Arg("id") id: number, @Root() post: Post): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  async createUser(@Arg("userInput") props: UserInput): Promise<boolean> {
    const user = await this.userRepo.save({
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
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return false;
    }

    user.name = props.name;
    user.email = props.email;

    const res = await this.userRepo.save(user);

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    const res = await this.userRepo.delete({
      id,
    });

    return !!res;
  }

  @Mutation((returns) => Boolean)
  async verifyUser(@Arg("id") id: number): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      return false;
    }

    user.isVerified = true;

    const res = await this.userRepo.save(user);

    return !!res;
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User): Promise<Post[]> {
    const posts = await Post.find({
      where: {
        user: user,
      },
    });

    return posts;
  }
}
