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
        A.answer_text AS 'answer',
        A.date_answer AS 'respond',
        A.id_question,
        Q.id_user,
        Q.title,
        Q.question_text ,
        Q.date,
        U.name_user,
        A.id_user_expert AS 'id_expert',
        U.avatar AS 'avatar',
        LT.name_language,
           COALESCE((SUM(UR.rating)/(COUNT(UR.id_answer)-1)) , 0) AS 'rating',
        COUNT(A.id_question) AS 'answers'
    FROM answers A
    INNER JOIN questions Q ON A.id_question = Q.id
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    INNER JOIN users_rating UR ON A.id=UR.id_answer
    WHERE A.id_user_expert = ?
    GROUP BY A.id
    ORDER BY A.date_answer DESC;
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
