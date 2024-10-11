import "dotenv/config";
import "reflect-metadata";
import { DB } from "./utils/db";
import { runApp } from "./app";

DB.initialize()
  .then(() => runApp())
  .catch((err) => console.log(err));
