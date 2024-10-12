import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { getSchema } from "./utils/graphql";

export async function runApp() {
  const app = express();
  const port = process.env.APP_PORT || 8080;

  app.use(cors());

  const schema = await getSchema();

  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer) as any
  );

  app.listen(port, () => {
    console.log("app running at port " + port);
  });
}
