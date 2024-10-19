import nodemailer from "nodemailer";

export const mail = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "16d58b0c89cba1",
    pass: "f077a3dc3e2f84",
  },
});
