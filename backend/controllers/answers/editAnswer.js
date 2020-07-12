const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { editAnswerSchema } = require("../../validator/answersValidators");

async function editAnswer(req, res, next) {
  let connection;
  try {
    await editAnswerSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id_answer } = req.params;
    const { content } = req.body;

    //selecciono la info de la respuesta a editar

    const [currentAnwser] = await connection.query(
      `
    SELECT
        A.id AS 'id',
        A.answer_text,
        A.date_answer,
        A.id_question,
        A.id_user_expert,
        U.name_user AS 'userExpert',
        U.avatar,
        LT.name_language AS 'Language',
        AVG(UR.rating) AS 'rating'
    FROM answers A
    INNER JOIN questions Q ON A.id_question = Q.id
    INNER JOIN users U ON A.id_user_expert=U.id
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    INNER JOIN users_rating UR ON A.id=UR.id_answer
    WHERE A.id_user_expert = ?
    GROUP BY A.id;
      `,
      [req.auth.id]
    );

    if (currentAnwser[0].id_user_expert !== req.auth.id) {
      throw errorGenerator(`No tienes permiso para editar esta respuesta`, 409);
    }

    //Editar la pregunta
    await connection.query(
      `
      UPDATE answers
      SET answer_text=?, date_answer=UTC_TIMESTAMP, update_date=UTC_TIMESTAMP
      WHERE id=? AND id_user_expert=?
      `,
      [content, id_answer, req.auth.id]
    );

    res.send({
      status: "ok",
      message: `Has editado la respuesta ${id_answer}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editAnswer;
