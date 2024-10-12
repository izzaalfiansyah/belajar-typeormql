import { Field, ID, ObjectType } from "type-graphql";
import { Post } from "./post";
import { User } from "./user";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @ManyToOne(() => Post, (post) => post.likes)
  @Field((type) => [Post])
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.likes)
  @Field((type) => [User])
  @JoinColumn()
  user: User;

  @Column("timestamp", { default: () => "current_timestamp" })
  createdAt: Date;
}
