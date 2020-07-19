const Joi = require("@hapi/joi");
const { errorGenerator } = require("../helpers");

const newLanguageSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(errorGenerator(`El nombre del lenguage es obliatorio`, 400)),

  description: Joi.string()
    .min(25)
    .max(200)
    .required()
    .error(
      errorGenerator(
        `La descripcion del lenguage debe ser de maximo 200 caracteres`,
        400
      )
    ),
});

const editLanguageSchema = Joi.object().keys({
  name: Joi.string().error(
    errorGenerator(`El nombre del lenguage es obliatorio`, 400)
  ),

  description: Joi.string()
    .min(25)
    .max(200)
    .error(
      errorGenerator(
        `La descripcion del lenguage debe ser de maximo 200 caracteres`,
        400
      )
    ),
});

module.exports = { newLanguageSchema, editLanguageSchema };
