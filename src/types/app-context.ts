import { Request, Response } from "express";
import { User } from "../entity/user";

export interface AppContext {
  req: Request;
  res: Response;
  user: User | undefined;
}
