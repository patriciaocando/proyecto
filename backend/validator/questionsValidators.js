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
    .valid(
      "Javascript",
      "CSS",
      "HTML",
      "Java",
      "PHP",
      "SQL",
      "Angular",
      "Vue",
      "NodeJS"
    )
    .required()
    .error(
      errorGenerator(
        `Debes ingresar lenguage valido para realizar tu pregunta`,
        400
      )
    ),
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
  name: Joi.string(),
  search: Joi.string()
    .max(100)
    .error(
      errorGenerator(
        `Debes ingresar un titulo de maximo 100 caracteres para realizar tu pregunta`,
        400
      )
    ),
  status: Joi.string()
    .valid("true", "false")
    .error(
      errorGenerator(
        `Debes ingresar "true" para ver preguntas sin responsder o "false" para ver preguntas respondidas`,
        400
      )
    ),
  language: Joi.string()
    .valid(
      "Javascript",
      "CSS",
      "HTML",
      "Java",
      "PHP",
      "SQL",
      "Angular",
      "Vue",
      "NodeJS"
    )
    .error(
      errorGenerator(
        `Debes ingresar lenguage valido para realizar tu pregunta`,
        400
      )
    ),
  direction: Joi.string()
    .valid("ASC", "DESC")
    .error(errorGenerator(`Debes ingresar "ASC" o "DESC" para ordenar`, 400)),
});

module.exports = {
  postQuestionSchema,
  editQuestionSchema,
  filterQuestionsSchema,
};
