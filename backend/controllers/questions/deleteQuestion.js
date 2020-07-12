const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function deleteQuestion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_question } = req.params;

    //verifico que la pregunta existe
    const [currentQuestion] = await connection.query(
      `
      SELECT id,
      status_question,
      id_user
      FROM questions
      WHERE id=?
`,
      [id_question]
    );

    //verificar que el id del autor o el rol de usuario
    if (
      currentQuestion[0].id_user !== req.auth.id &&
      req.auth.role !== "admin"
    ) {
      throw errorGenerator(`No tienes permisos para borrar esta pregunta`, 403);
    }

    //si existe y el estado de la pregunta es true(respondido) busco el id de la respuesta, borro el rating y la respuesta
    if (currentQuestion.length === 0) {
      throw errorGenerator(
        `La pregunta con el id ${id_question} no existe`,
        400
      );
    } else if (currentQuestion[0].status_question === 1) {
      //seleccionar la respuesta
      const [currentAnswer] = await connection.query(
        `
        SELECT id
        FROM answers
        WHERE id_question =?
        `,
        [id_question]
      );

      //console.log(currentAnswer);
      for (const answer of currentAnswer) {
        //borrar el rating
        await connection.query(
          `
            DELETE FROM users_rating
            WHERE id_answer=?
            `,
          [answer.id]
        );
        //borrar la respuesta
        await connection.query(
          `
          DELETE FROM answers
          WHERE id=?`,
          [answer.id]
        );
      }
    }

    //borrar la pregunta
    await connection.query(
      `
      DELETE FROM questions
      WHERE id=?
      `,
      [id_question]
    );

    res.send({
      status: "ok",
      message: `Has borrado la pregunta ${id_question} y sus respuestas asociadas`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteQuestion;
