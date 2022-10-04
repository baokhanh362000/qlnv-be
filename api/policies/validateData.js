module.exports = async function (req, res, next) {
  try {
    const { body, query, user } = req;
    const bodyStr = JSON.stringify(body);
    const queryStr = JSON.stringify(query);
    const errorChar = ["delete", "destroy", ";", ":", "'", "eval"];
    for (const char of errorChar) {
      if (bodyStr.includes(char) || queryStr.includes(char)) {
        return res.error("Data error");
      }
    }
    next();
  } catch (error) {
    console.log(error);
    return res.forbidden();
  }
};
