import { MaxLength, MinLength } from "class-validator";
import { ArgsType, Field, ID, InputType } from "type-graphql";

@ArgsType()
export class PostArgs {
  @Field((type) => Boolean, { nullable: true })
  isPublished?: boolean;

  @Field((type) => ID, { nullable: true })
  userId?: number;
}

@InputType()
export class PostInput {
  @Field()
  @MaxLength(50)
  title: string;

  @Field()
  @MinLength(10)
  content: string;

  @Field((type) => Boolean, { nullable: true })
  isPublished?: boolean;

  @Field((type) => ID)
  userId: number;
}
