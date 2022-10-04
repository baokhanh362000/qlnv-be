module.exports = async function (req, res, next) {
  try {
    const { user, route, method } = req;
    if (user?.site === "admin") return next();
    const role = await BKRole.findOne({ id: user.role });
    if (!role) return res.forbidden();
    const { apis } = role;
    const arr = route.path.split("/");
    const model = arr[arr.length - 1];
    let api = "view";
    switch (method) {
      case "GET":
        api = "view";
        break;
      case "PATCH":
        api = "update";
        break;
      case "DELETE":
        api = "delete";
        break;
      case "POST":
        api = "create";
        break;
      default:
        break;
    }
    if (apis[model][api]) return next();
    return res.forbidden();
  } catch (error) {
    console.log(error);
    return res.forbidden();
  }
};
