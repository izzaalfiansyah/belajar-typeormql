import { Arg, Args, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { User } from "../entity/user";
import { NewUserInput, UserArgs } from "./args/user-args";
import { DB } from "../utils/db";

@Resolver()
export class UserResolver {
  constructor(private userRepo: Repository<User> = DB.getRepository(User)) {}

  @Query((returns) => [User])
  async users(@Args() props: UserArgs) {
    let where: any = {};

    if (props.isVerified != null) {
      where.isVerified = props.isVerified;
    }

    const users = await this.userRepo.find({
      where,
      relations: ["posts"],
    });

    return users;
  }

  @Query((returns) => User)
  async user(@Arg("id") id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["posts"],
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  async createUser(@Arg("newUser") props: NewUserInput) {
    const user = await this.userRepo.save({
      name: props.name,
      email: props.email,
    });

    return !!user;
  }
}
