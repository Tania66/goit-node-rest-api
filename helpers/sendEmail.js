import nodemailer from "nodemailer";
import "dotenv/config";

const { SECRET_PASSWORD_MAILTRAP, USER_MAILTRAP } = process.env;

const nodemailerConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: USER_MAILTRAP,
    pass: SECRET_PASSWORD_MAILTRAP,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const emailSend = async (data) => {
  const email = { ...data, from: "getdavibe@meta.ua" };
  await transport.sendMail(email);
  return true;
};
