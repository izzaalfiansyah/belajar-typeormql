import { IsEmail, IsStrongPassword, MaxLength } from "class-validator";
import { ArgsType, Field, InputType } from "type-graphql";

@ArgsType()
export class UserArgs {
  @Field((type) => Boolean, { nullable: true })
  isVerified?: boolean;
}

@InputType()
export class UserInput {
  @Field()
  @MaxLength(50)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class UserInputWithPassword extends UserInput {
  @Field()
  // @IsStrongPassword()
  password: string;
}
