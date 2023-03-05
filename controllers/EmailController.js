import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmailMessage = async (sendTo, subject, message) => {
  const email_message = {
    from: `\'"Sogl.online" <${process.env.SMTP_USER}>\'`,
    to: sendTo,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(email_message).catch((error) => {
    console.log(error);
  });
};
