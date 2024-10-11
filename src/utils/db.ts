import { DataSource } from "typeorm";
import { User } from "../entity/user";
import { Post } from "../entity/post";

export const DB = new DataSource({
  host: (process.env.DB_HOST as any) || "localhost",
  type: (process.env.DB_TYPE as any) || "mysql",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "test",
  entities: [User, Post],
  synchronize: true,
  logging: true,
});
