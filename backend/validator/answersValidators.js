const Joi = require("@hapi/joi");
const { errorGenerator } = require("../helpers");

const postAnswerSchema = Joi.object().keys({
  content: Joi.string()
    .min(10)
    .error(
      errorGenerator(
        `Debes ingresar un texto de minimo 10 caracteres para realizar tu respuesta`,
        400
      )
    ),
});

const editAnswerSchema = postAnswerSchema;

const ratingAnswerSchema = Joi.object().keys({
  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .error(errorGenerator(`Voto incorrecto debe ser entre 1 y 5`, 400)),
});

module.exports = { postAnswerSchema, editAnswerSchema, ratingAnswerSchema };
