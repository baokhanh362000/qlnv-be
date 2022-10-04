module.exports = function success(optionalData) {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  return res.json({
    ...optionalData,
    errorMsg: "Success",
    errorCode: 0,
  });
};
