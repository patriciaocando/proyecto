const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getAnswers(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [answers] = await connection.query(
      `
    SELECT
        A.id AS 'id',
        A.answer_text,
        A.date_answer,
        A.id_question,
        Q.title,
        Q.question_text,
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

    if (answers.length === 0) {
      throw errorGenerator(
        `EL usuario con id ${req.auth.id} no ha realizado ninguna respuesta`,
        404
      );
    }

    res.send({
      status: "ok",
      data: answers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getAnswers;
