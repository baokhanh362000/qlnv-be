/**
 * BKAuth.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    user: { type: "string" },
    site: { type: "string", isIn: ["admin", "customer"] },
    status: { type: "boolean", defaultsTo: true },
  },
};
