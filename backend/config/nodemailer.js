const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail" ,
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});


const sendMailNodemailer = async ({ to, subject, text, html }) => {
  try {

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

module.exports = sendMailNodemailer;
