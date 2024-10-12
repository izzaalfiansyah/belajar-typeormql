import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "./post";
import { User } from "./user";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class PostLike extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Field((type) => ID)
  @Column("integer")
  postId: number;

  @ManyToOne(() => Post, (post) => post.likes)
  @Field((type) => [Post])
  @JoinColumn()
  post: Post;

  @Field((type) => ID)
  @Column("integer")
  userId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @Field((type) => [User])
  @JoinColumn()
  user: User;

  @Column("timestamp", { default: () => "current_timestamp" })
  createdAt: Date;
}
