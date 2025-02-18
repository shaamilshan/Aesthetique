// utils/mailSender.js
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "oliviarodrigo9846@gmail.com",
        pass: "zqeb epfq paij zedt",
      },
    });
    const mailOptions = {
      from: "oliviarodrigo9846@gmail.com",
      to: "govindhansv333@gmail.com",
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    };

    // let transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });
    // Send emails to users
    let info = transporter.sendMail(
      {
        from: "TrendsKart - Email Verification",
        to: email,
        subject: title,
        html: body,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      }
    );

    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;
