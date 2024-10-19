import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post";
import { Field, ID, ObjectType } from "type-graphql";
import { PostLike } from "./post-like";
import { PostComment } from "./post-comment";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({
    default: "$2b$12$DH0uNYgyj9GOaQFh0f/MR.YAXXndWwxps/Ybb6T92ITViqEDusyW.",
    // 12345678
  })
  password: string;

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
  postLikes: PostLike[];

  @Field(() => [PostComment])
  @OneToMany(() => PostComment, (comment) => comment.user)
  postComments: PostComment[];
}
