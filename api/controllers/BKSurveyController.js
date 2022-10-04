/**
 * BKUserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Queue = require("bull");
const nodemailer = require("nodemailer");
const moment = require("moment");

module.exports = {
  activeSurvey: async (req, res) => {
    try {
      const { id } = req.body;
      const survey = await BKSurvey.findOne({ id });
      if (!survey) return res.error();
      const customersId = survey.customer;
      const customers = await BKCustomer.find({ id: customersId });
      const sendMsg = new Queue("sendMsg", sails.config.custom.redis);
      sendMsg.process(function (job) {
        sendmail(job.data);
      });
      for (const customer of customers) {
        sendMsg.add({
          email: customer.email,
          subject: survey.title,
          text: survey.title,
          html: `<b>survey.title</b> Please click link http://localhost:3000/survey?id=${survey.id}&cutomer=${customer.id}`,
        });
      }
      await BKSurvey.update({ id }).set({
        status: true,
        exp: moment().valueOf() + 30 * 60 * 1000,
      });
      return res.success();
    } catch (error) {
      console.log(error);
    }
  },
  getSurvey: async (req, res) => {
    try {
      const { id, customerId } = req.body;
      const survey = await BKSurvey.find({
        where: {
          id,
          customer: {
            contains: customerId,
          },
          exp: {
            ">=": moment().valueOf(),
          },
        },
      });
      if (!survey.length) {
        return res.error();
      }
      return res.success({
        title: survey[0].title,
      });
    } catch (error) {
      console.log(error);
    }
  },
  postSurvey: async (req, res) => {
    try {
      const { id, customer } = req.body;
      const survey = await BKSurvey.find({
        where: {
          id,
          customer: {
            contains: customer,
          },
          exp: {
            ">=": moment().valueOf(),
          },
        },
      });
      if (!survey.length) return res.error();
      const surveydata = await BKSurveyData.find({
        survey: id,
        customer,
      });
      if (surveydata.length) return res.error();
      await BKSurveyData.create({
        survey: id,
        customer,
      });
      const customerInfo = await BKCustomer.findOne({ id: customer });
      await BKCustomer.update({ id: customer }).set({
        pocket: customerInfo.pocket + Number(survey[0].price),
      });
      return res.success();
    } catch (error) {
      console.log(error);
    }
  },
};
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: sails.config.custom.usermail,
    pass: sails.config.custom.passmail,
  },
});
async function sendmail({ email, subject, text, html }) {
  await transporter.sendMail({
    from: '"KMA Fortal" <AT150528@actvn.edu.vn>',
    to: email,
    subject,
    text,
    html,
  });
}
