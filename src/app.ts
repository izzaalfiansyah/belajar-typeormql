import express from "express";
import cors from "cors";
import { graphQLRouter } from "./router/graphql";
import { typeGraphQLRouter } from "./router/typegraphql";

export function runApp() {
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(cors());
  app.use(graphQLRouter);
  app.use(typeGraphQLRouter);

  app.listen(port, () => {
    console.log("app running at port " + port);
  });
}
