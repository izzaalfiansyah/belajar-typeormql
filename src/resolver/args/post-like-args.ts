import { Field, ID, InputType } from "type-graphql";

@InputType()
export class PostLikeInput {
  @Field((type) => ID)
  userId: number;

  @Field((type) => ID)
  postId: number;
}
