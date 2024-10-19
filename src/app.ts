import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { getSchema, pubSub } from "./utils/graphql";
import session from "express-session";
import { redis } from "./utils/redis";
import RedisStore from "connect-redis";
import { User } from "./entity/user";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import CACHE from "./types/redis-types";

const port = process.env.APP_PORT || 8080;
export const baseUrl = "http://localhost:" + port;

export async function runApp() {
  const app = express();

  app.use(cors());

  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(
    session({
      name: "gql",
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
      context: async ({ req, res }) => {
        const userCache = await redis.get(CACHE.PROFILE);

        let user: User | null;
        const userId = (req.session as any).userId;

        if (userId) {
          if (!!userCache) {
            user = JSON.parse(userCache);
          } else {
            user = await User.findOne({
              where: { id: (req.session as any).userId },
            });

            await redis.set(CACHE.PROFILE, JSON.stringify(user));
          }
        } else {
          await redis.del(CACHE.PROFILE);
          user = null;
        }

        return {
          req,
          res,
          user,
          pubSub,
        } as any;
      },
    }) as any
  );

  app.get("/user/verify/:token", async (req, res) => {
    const id = await redis.get(req.params.token);

    if (id) {
      const user = await User.findOne({ where: { id: parseInt(id) } });

      if (user) {
        user.isVerified = true;
        await user.save();
        res.send("Your account has been verified.");
        return;
      }
    }

    res.send("Verify account failed.");
  });

  const http = createServer(app);

  const ws = new WebSocketServer({
    server: http,
    path: "/graphql",
  });

  useServer({ schema }, ws);

  http.listen(port, () => {
    console.log("app running at port " + port);
  });
}
