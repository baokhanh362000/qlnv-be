/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /auth/getcaptcha": {
    controller: "BKAuthController",
    action: "getCaptcha",
  },
  "POST /auth/login": {
    controller: "BKAuthController",
    action: "login",
  },
  "POST /auth/register": {
    controller: "BKAuthController",
    action: "register",
  },
  "GET /checkPolicy": {
    controller: "BKRoleController",
    action: "checkPolicy",
  },
  "POST /auth/forgotpassword": {
    controller: "BKAuthController",
    action: "forgotPassword",
  },
  "POST /activeSurvey": {
    controller: "BKSurveyController",
    action: "activeSurvey",
  },
  "POST /getSurvey": {
    controller: "BKSurveyController",
    action: "getSurvey",
  },
  "POST /postSurvey": {
    controller: "BKSurveyController",
    action: "postSurvey",
  },
};
