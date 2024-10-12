import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";
import { Field, ID, ObjectType } from "type-graphql";
import { PostLike } from "./post-like";

@ObjectType()
@Entity()
export class Post {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column("text")
  content: string;

  @Field((type) => Boolean)
  @Column({
    default: false,
  })
  isPublished: boolean;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Field((type) => [PostLike])
  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];
}
