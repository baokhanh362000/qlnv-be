/**
 * BKAuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const randtoken = require("rand-token");
const svgCaptcha = require("svg-captcha");
const moment = require("moment");
const nodemailer = require("nodemailer");

module.exports = {
  getCaptcha: async (req, res) => {
    try {
      const captcha = svgCaptcha.create();
      await BKCaptcha.create({
        text: captcha.text,
        expAt: moment().valueOf() + 5 * 60 * 1000,
      });
      return res.success({
        captcha: captcha.data,
      });
    } catch (error) {
      res.serverError();
    }
  },
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password)
        return res.error({
          errorMsg: "Username or email required",
        });
      const access = await BKCustomer.find({
        or: [{ email }, { username }],
      });
      if (access.lenght) {
        return res.error({
          errorMsg: "Username or email already exis",
        });
      }

      const hash = await argon2.hash(password);
      const auth = await BKAuth.create({ username, password: hash }).fetch();
      const customer = await BKCustomer.create({
        username,
        email,
        auth: auth.id,
      }).fetch();
      await BKAuth.update({ id: auth.id }).set({ user: customer.id });
      return res.success();
    } catch (error) {
      res.serverError();
    }
  },
  login: async (req, res) => {
    try {
      const { username, password, captcha } = req.body;
      if (!captcha) return res.error("Wrong capcha");
      const checkCaptcha = await BKCaptcha.find({
        where: {
          text: captcha,
          expAt: {
            ">=": moment().valueOf(),
          },
        },
      });
      if (!checkCaptcha.length) return res.error("Wrong capcha");
      const auth = await BKAuth.findOne({ username });
      const loginFailMsg = "Username or password is wrong";
      if (!auth) return res.error(loginFailMsg);
      const checkPass = await argon2.verify(auth.password, password);
      if (!checkPass) return res.error(loginFailMsg);
      let user = {};
      if (auth.site == "admin") {
        user = await BKUser.findOne({ id: auth.user });
      } else {
        user = await BKCustomer.findOne({ id: auth.user });
      }
      if (!user?.status) return res.error("This account is blocking");
      const accessToken = jwt.sign(
        {
          username,
          id: user.id,
        },
        sails.config.custom.secret,
        { expiresIn: "10h" }
      );
      const refreshToken = randtoken.generate(16);
      if (await BKToken.findOne({ user: user.id })) {
        await BKToken.update({ user: user.id }).set({ token: refreshToken });
      } else {
        await BKToken.create({
          token: refreshToken,
          user: user.id,
        });
      }
      return res.success({
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      res.serverError();
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.error("Invalid email");
      const user = await BKCustomer.findOne({ email });
      if (!user) return res.error("Invalid email");
      const newPassword = randtoken.generate(16);
      const hashPassword = await argon2.hash(newPassword);
      await BKAuth.update({ user: user.id }).set({ password: hashPassword });
      await sendmail({
        email,
        subject: "Forgot password",
        text: "Go go http://localhost:3000/auth to login",
        html: `<p> Your new password is <b>${newPassword}<b> </p>`,
      });
      return res.success();
    } catch (error) {
      res.serverError();
    }
  },
  changePassword: async (req, res) => {
    try {
      const { userId, password, newPassword } = req.body;
      if (!userId) res.error();
      const acc = await BKAuth.findOne({ user: userId });
      const checkPass = await argon2.verify(acc.password, password);
      if (!checkPass) return res.error("Password is wrong");
      const hashNewPass = await argon2.hash(newPassword);
      await BKAuth.update({ user: userId }).set({
        password: hashNewPass,
      });
      return res.success();
    } catch (error) {
      res.serverError();
    }
  },
};
async function sendmail({ email, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: sails.config.custom.usermail,
      pass: sails.config.custom.passmail,
    },
  });
  await transporter.sendMail({
    from: '"KMA Fortal" <AT150528@actvn.edu.vn>',
    to: email,
    subject,
    text,
    html,
  });
}
