import { Request, Response } from "express";
import { User } from "../entity/user";
import { PubSub } from "type-graphql";

export interface AppContext {
  req: Request;
  res: Response;
  user: User | undefined;
  pubSub: PubSub;
}
