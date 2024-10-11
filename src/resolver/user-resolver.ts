import { Args, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { User } from "../entity/user";

@Resolver()
export class UserResolver {
  constructor(private userRepo: Repository<User>) {}

  @Query((returns) => [User])
  async getUsers(@Args() props: { isVerified?: boolean }) {
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
  async getUser(@Args() props: { id: number }) {
    const user = await this.userRepo.findOne({
      where: { id: props.id },
      relations: ["posts"],
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  async createUser(@Args() props: User) {
    const user = await this.userRepo.save({
      name: props.name,
      email: props.email,
    });

    return !!user;
  }
}
