import { createClient } from "redis";

export const redis = createClient();

redis.connect().catch((err) => {
  console.log(err);
});
