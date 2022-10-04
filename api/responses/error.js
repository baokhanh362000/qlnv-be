module.exports = function success(errorMsg = "error") {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;
  const status = 500;
  return res.status(status).json({
    errorMsg,
  });
};
