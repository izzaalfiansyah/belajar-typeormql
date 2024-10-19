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

const sendEmailToUserWorker = new Worker(
  "sendEmailToUser",
  async (job: Job) => {
    const { email, name, id } = job.data;

    console.log("generating token");
    await job.updateProgress(20);

    const token = uuid();
    await redis.set(token, id, "EX", 60 * 60 * 24);

    console.log("token has been generated");
    console.log("sending email to user");
    await job.updateProgress(60);

    try {
      await mail.sendMail({
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

      console.log("email has sended");
      await job.updateProgress(100);
    } catch (e) {
      throw new Error("email not sended");
    }
  },
  { connection: redis }
);

sendEmailToUserWorker.on("failed", (job, err) => {
  console.log(err);
});
