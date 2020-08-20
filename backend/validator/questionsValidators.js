const Joi = require("@hapi/joi");
const { errorGenerator } = require("../helpers");

const postQuestionSchema = Joi.object().keys({
  title: Joi.string()
    .min(15)
    .max(180)
    .required()
    .error(
      errorGenerator(`Debes ingresar un titulo para realizar tu pregunta`, 400)
    ),
  content: Joi.string()
    .required()
    .min(25)
    .error(
      errorGenerator(
        `Debes ingresar un texto de minimo 25 caracteres para realizar tu pregunta`,
        400
      )
    ),
  language: Joi.string()
    .required()
    .error(errorGenerator(`Debes escoger un lenguaje`, 400)),
});

const editQuestionSchema = Joi.object().keys({
  title: Joi.string()
    .min(15)
    .max(180)
    .error(
      errorGenerator(
        `Debes ingresar un titulo de minimo 15 caracteres para realizar tu pregunta`,
        400
      )
    ),
  content: Joi.string()
    .min(25)
    .error(
      errorGenerator(
        `Debes ingresar un texto de minimo 25 caracteres para realizar tu pregunta`,
        400
      )
    ),
});

const filterQuestionsSchema = Joi.object().keys({
  name: Joi.any(),
  search: Joi.any(),
  status: Joi.string()
    .valid("true", "false", "")
    .error(
      errorGenerator(
        `Debes ingresar "true" para ver preguntas sin responsder o "false" para ver preguntas respondidas`,
        400
      )
    ),
  direction: Joi.any(),
  language: Joi.any(),
  date_init: Joi.any(),
  date_end: Joi.any(),
});

module.exports = {
  postQuestionSchema,
  editQuestionSchema,
  filterQuestionsSchema,
};
