const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.forbidden();
    const basic = auth.split(" ")[1];
    if (basic === sails.config.custom.basic) return next();
    return res.forbidden();
  } catch (error) {
    console.log(error);
    return res.forbidden();
  }
};
