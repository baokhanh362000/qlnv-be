module.exports = function success() {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;
  const status = 400;
  return res.status(status).json({
    errorMsg: "Server Error",
  });
};
