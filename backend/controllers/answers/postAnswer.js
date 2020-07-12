const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { postAnswerSchema } = require("../../validator/answersValidators");

async function postAnswer(req, res, next) {
  let connection;
  try {
    await postAnswerSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id_question } = req.params;
    const { content } = req.body;

    //traer la info de la pregunta que se quiere responder
    const [currentQuestion] = await connection.query(
      `
    SELECT id_language
    FROM questions
    WHERE id=?
    `,
      [id_question]
    );

    //verificar que el usuario sea experto en el lenguaje de la pregunta
    const [userExpert] = await connection.query(
      `
    SELECT *
    FROM users_languages 
    WHERE id_user=? AND id_language=?
    `,
      [req.auth.id, currentQuestion[0].id_language]
    );

    //Si no tiene el mismo lenguage no puede responder esa pregunta
    if (userExpert.length === 0) {
      throw errorGenerator(
        `No eres experto en este lenguaje, no puedes responder esta pregunta`,
        400
      );
    }

    //verificar que no existe una pregunta con el mismo ID??
    const [result] = await connection.query(
      `INSERT INTO answers
        (answer_text, 
        date_answer,
        id_question, 
        id_user_expert,
        update_date,
        creation_date)
        values(?,UTC_TIMESTAMP,?,?, UTC_TIMESTAMP, UTC_TIMESTAMP)
        `,
      [content, id_question, req.auth.id]
    );

    if (!content) {
      throw errorGenerator(`Tu respuesta tiene que tenter contenido`, 400);
    }

    await connection.query(
      `
      UPDATE questions
      SET status_question=true
      WHERE id=?
      `,
      [id_question]
    );

    // insertar el la tabla de raiting la rspuesta que se acaba de constestar
    await connection.query(
      `
      INSERT INTO users_rating
        (id_user,
        id_answer,
        rating,
        update_date)
      VALUES(?,?,0,UTC_TIMESTAMP)`,
      [req.auth.id, result.insertId]
    );

    res.send({
      status: "ok",
      data: {
        idAnswer: result.insertId,
        content,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postAnswer;
