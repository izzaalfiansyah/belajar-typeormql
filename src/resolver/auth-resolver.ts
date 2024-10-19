import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import { AppContext } from "../types/app-context";
import { LoginInput } from "./args/auth-args";
import { User } from "../entity/user";
import bcrypt from "bcrypt";
import { sendEmailToUserQueue } from "../queue/user-queue";
import { redis } from "../utils/redis";
import { UserInput } from "./args/user-args";
import CACHE from "../types/redis-types";

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
    await redis.set(CACHE.PROFILE, JSON.stringify(user));

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.req.session.destroy((err) => {
      console.log(err);
    });
    ctx.res.clearCookie("gql");
    await redis.del(CACHE.PROFILE);

    return true;
  }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() ctx: AppContext): Promise<User | undefined> {
    return ctx.user;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async updateProfile(
    @Ctx() ctx: AppContext,
    @Arg("input") input: UserInput
  ): Promise<boolean> {
    const user = ctx.user?.id
      ? await User.findOne({ where: { id: ctx.user!.id } })
      : null;

    if (!!user) {
      user.name = input.name;
      user.email = input.email;

      await user.save();
      await redis.set(CACHE.PROFILE, JSON.stringify(user));
    }

    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async sendVerifyEmail(@Ctx() ctx: AppContext): Promise<boolean> {
    await sendEmailToUserQueue.add("sendVerifyEmail", ctx.user!);
    return true;
  }
}
