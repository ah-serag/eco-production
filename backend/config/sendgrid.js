const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  sendEmail: async ({ to, subject, text, html }) => {
    try {
      const msg = {
        to,
        from: process.env.EMAIL_FROM,
        subject,
        text,
        html,
      };

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
