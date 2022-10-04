/**
 * BKUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: { type: "string", required: true, unique: true },
    email: { type: "string", required: true },
    status: { type: "boolean", defaultsTo: true },
    site: {
      type: "string",
      isIn: ["admin", "employee"],
      defaultsTo: "employee",
    },
    role: { model: "bkrole" },
    phone: { type: "string" },
    desc: { type: "string" },
    auth: { type: "string", required: true },
  },
};
