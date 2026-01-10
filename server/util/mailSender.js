// utils/mailSender.js
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Prefer SMTP configuration from environment variables. If not provided,
    // fall back to a sensible default (Gmail) but do not keep real credentials
    // in source — override them in your environment for production.
    const host = process.env.MAIL_HOST || "smtp.gmail.com";
    const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 465;
    const secure = process.env.MAIL_SECURE ? process.env.MAIL_SECURE === "true" : port === 465;
    const user = process.env.MAIL_USER || null;
    const pass = process.env.MAIL_PASS || null;

    const transporterOptions = {
      host,
      port,
      secure,
    };

    if (user && pass) {
      transporterOptions.auth = { user, pass };
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    // Use promise-based sendMail so we can await the result and return it
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || (user || "no-reply@example.com"),
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent: ", info.response || info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error && error.message ? error.message : error);
    throw error;
  }
};
module.exports = mailSender;
