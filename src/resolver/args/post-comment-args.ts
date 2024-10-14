import { MinLength } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class PostCommentInput {
  @Field(() => ID, {
    nullable: true,
  })
  postId?: number;

  @Field()
  @MinLength(5)
  text: string;

  @Field(() => ID, {
    nullable: true,
  })
  parentId?: number;
}
