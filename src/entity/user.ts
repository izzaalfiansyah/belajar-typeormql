import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post";
import { Field, ID, ObjectType } from "type-graphql";
import { PostLike } from "./post-like";

@ObjectType()
@Entity()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field((type) => Boolean)
  @Column({
    default: false,
  })
  isVerified: boolean;

  @Field((type) => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Field((type) => [PostLike])
  @OneToMany(() => PostLike, (like) => like.user)
  likes: PostLike[];
}
