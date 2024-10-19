import { Job, Queue, Worker } from "bullmq";
import { redis } from "../utils/redis";
import { mail } from "../utils/mail";
import { v4 as uuid } from "uuid";
import { baseUrl } from "../app";

export const sendEmailToUserQueue = new Queue<{
  email: string;
  name: string;
  id: number;
}>("sendEmailToUser", {
  connection: redis,
});

new Worker(
  "sendEmailToUser",
  async (job: Job) => {
    const { email, name, id } = job.data;

    const token = uuid();
    console.log(id);
    await redis.set(token, id, "EX", 60 * 60 * 24);

    mail.sendMail({
      subject: "Verify Your Account",
      to: email,
      from: "dev@admin.com",
      html:
        `<html>` +
        `<body>` +
        `<div>` +
        `Hello ${name}! Please verify yout account by clicking ` +
        `<a href="${baseUrl}/user/verify/${token}" target="_blank">this link</a>.` +
        `</div>` +
        `</body>` +
        `</html>`,
    });
  },
  { connection: redis }
);
