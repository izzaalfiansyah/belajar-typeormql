import { Request, Response } from "express";
import { User } from "../entity/user";
import { pubSub } from "../app";

export interface AppContext {
  req: Request;
  res: Response;
  user: User | undefined;
  pubSub: typeof pubSub;
}
