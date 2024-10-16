import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { getSchema } from "./utils/graphql";
import session from "express-session";
import { redis } from "./utils/redis";
import RedisStore from "connect-redis";

export async function runApp() {
  const app = express();
  const port = process.env.APP_PORT || 8080;

  app.use(cors());

  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(
    session({
      store: redisStore,
      secret: "itsjustsecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      },
    })
  );

  const schema = await getSchema();

  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apolloServer, {
      context: ({ req }) => {
        return {
          req,
        } as any;
      },
    }) as any
  );

  app.listen(port, () => {
    console.log("app running at port " + port);
  });
}
