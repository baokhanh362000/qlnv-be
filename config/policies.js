/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  "*": ["auth", "checkRole", "validateData"],
  BKRoleController: {
    checkPolicy: ["auth"],
  },
  BKAuthController: {
    getCaptcha: ["basic"],
    login: ["basic"],
    register: ["basic"],
    forgot: ["basic"],
  },
  BKSurveyController: {
    activeSurvey: ["auth"],
    getSurvey: ["basic"],
    postSurvey: ["validateData", "basic"],
  },
};
