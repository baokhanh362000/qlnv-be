const nodemailer = require("nodemailer");
module.exports = {
  friendlyName: "Sendmail",
  description: "Sendmail something.",

  inputs: {},

  fn: async (inputs) => {
    const { email, subject, text, html } = inputs;
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "AT150528@actvn.edu.vn",
        pass: "Fam22084",
      },
    });
    const send = await transporter.sendMail({
      from: '"KMA Fortal" <AT150528@actvn.edu.vn>',
      to: email,
      subject,
      text,
      html,
    });
    return send;
  },
};
