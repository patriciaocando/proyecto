const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function deleteAnswer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_answer } = req.params;

    //verificar si existe la respuesta
    //saco el id question
    const [currentAnswer] = await connection.query(
      `
      SELECT id, id_question
      FROM answers
      WHERE id=?
    `,
      [id_answer]
    );

    //Si no existe da un error
    if (currentAnswer.length === 0) {
      throw errorGenerator(
        `La respuesta con el id ${id_answer} no existe`,
        400
      );
    } else {
      try {
        //borrar el rating
        await connection.query(
          `
        DELETE FROM users_rating
        WHERE id_answer=?
              `,
          [id_answer]
        );

        //Borro la respuesta
        await connection.query(
          `
        DELETE FROM answers
        WHERE id=?
        `,
          [id_answer]
        );

        //verifico si tiene mas respuestas
        const [otherAnswersOfSameQuestion] = await connection.query(
          `
        SELECT COUNT(id) AS 'count'
        FROM answers
        WHERE id_question=?
        `,
          [currentAnswer[0].id_question]
        );

        if (otherAnswersOfSameQuestion[0].count === 0) {
          //actualizo el status question a false
          await connection.query(
            `
        UPDATE questions
        SET status_question=0, update_date=UTC_TIMESTAMP
        WHERE id=?
        `,
            [currentAnswer[0].id_question]
          );
        }
      } catch (error) {
        throw errorGenerator(`No se ha podido borrar la respuesta`, 400);
      }
    }

    res.send({
      status: "ok",
      message: `Has borrado la respuesta con el id ${id_answer}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteAnswer;
