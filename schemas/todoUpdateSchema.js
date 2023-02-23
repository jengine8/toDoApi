const ajvInstance = require("../libs/ajv-config");

const todoUpdateSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 3, maxLength: 32 },
    description: { type: "string", minLength: 3, maxLength: 255 },
    progressStatus: {
      type: "number",
      format: "float",
      minimum: 0,
      maximum: 100,
    },
    deadline: { type: "string", format: "date-time" },
    comments: { type: "string", minLength: 3, maxLength: 255 },
    responsible: { type: "string" },
    tags: {
      minLength: 3,
      maxLength: 255,
      type: "string",
    },
    owner: {
      type: "number",
    },
  },

  additionalProperties: false,
};

module.exports = ajvInstance.compile(todoUpdateSchema);
