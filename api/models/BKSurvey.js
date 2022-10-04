module.exports = {
  attributes: {
    title: { type: "string", required: true },
    customer: { type: "json" },
    status: { type: "boolean", defaultsTo: false },
    price: { type: "number", defaultsTo: 0 },
    exp: { type: "number" },
  },
};
