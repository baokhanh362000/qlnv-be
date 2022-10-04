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
    role: { model: "tdrole" },
    phone: { type: "string" },
    address: { type: "string" },
    desc: { type: "string" },
    pocket: { type: "number", defaultsTo: 0 },
    auth: { type: "string", required: true },
  },
};
