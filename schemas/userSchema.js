const ajvInstance = require("../libs/ajv-config");

const userSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

module.exports = ajvInstance.compile(userSchema);
