import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Post } from "./post";
import { User } from "./user";

@Entity()
@ObjectType()
@Tree("nested-set")
export class PostComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  text: string;

  @Column("int", { nullable: true })
  @Field(() => ID, { nullable: true })
  postId?: number;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: true })
  @Field(() => Post, { nullable: true })
  post?: Post;

  @Column("int")
  @Field(() => ID)
  userId?: number;

  @ManyToOne(() => User, (user) => user.postComments)
  @Field(() => User)
  user: User;

  @TreeParent({ onDelete: "CASCADE" })
  @Field(() => PostComment, { nullable: true })
  parent?: PostComment;

  @TreeChildren({
    cascade: true,
  })
  @Field(() => [PostComment])
  children: PostComment[];
}
