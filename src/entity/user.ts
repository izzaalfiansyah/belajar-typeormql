import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
