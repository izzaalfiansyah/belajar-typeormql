import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import { AppContext } from "../types/app-context";
import { LoginInput } from "./args/auth-args";
import { User } from "../entity/user";
import bcrypt from "bcrypt";

export class AuthResolver {
  @Mutation(() => Boolean)
  async login(
    @Arg("input") input: LoginInput,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email: input.email } });

    if (!user) {
      return false;
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      return false;
    }

    (ctx.req.session as any).userId = user.id;

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.req.session.destroy((err) => {
      console.log(err);
    });
    ctx.res.clearCookie("gql");

    return true;
  }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() ctx: AppContext): Promise<User | undefined> {
    return ctx.user;
  }
}
