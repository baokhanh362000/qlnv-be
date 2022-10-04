const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.forbidden();
    const accessToken = auth.split(" ")[1];
    const decoded = jwt.verify(accessToken, sails.config.custom.secret);
    const customer = await BKCustomer.findOne({ username: decoded.username });
    if (customer && customer.status) {
      req.user = customer;
      return next();
    }
    const user = await BKUser.findOne({ username: decoded.username });
    if (!user || !user.status) return res.forbidden();
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.forbidden();
  }
};
