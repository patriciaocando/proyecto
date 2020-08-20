const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getUserQuestions(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT 
        Q.id AS 'id', 
        Q.title, 
        Q.question_text, 
        Q.date, 
        Q.status_question,
        U.name_user, 
        U.avatar, 
        LT.name_language
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    WHERE Q.id_user=?
    ORDER BY Q.date DESC;
      `,
      [req.auth.id]
    );

    /*  if (result.length === 0) {
      throw errorGenerator(`No has hecho ninguna pregunta aun`, 400);
    } */

    let resultAnswers = [];
    let count = 0;
    for (const id of result) {
      const [answer] = await connection.query(
        `
        SELECT
            A.id AS 'id',
            A.answer_text AS 'answer',
            A.date_answer AS 'date',
            A.id_question,
            A.id_user_expert,
            U.name_user AS 'expert',
            U.avatar,
            LT.name_language,
            AVG(UR.rating) AS 'rating',
            COUNT(A.id_question) AS 'answers',
            COUNT(UR.id_answer) AS 'total_votes'
        FROM answers A
        INNER JOIN questions Q ON A.id_question = Q.id
        INNER JOIN users U ON A.id_user_expert=U.id
        INNER JOIN languages_tech LT ON Q.id_language=LT.id
        INNER JOIN users_rating UR ON A.id=UR.id_answer
        WHERE A.id_question = ?
        GROUP BY A.id;
      `,
        [id.id]
      );

      resultAnswers.push({
        question: result[count++],
        answer: answer,
      });
    }
    res.send({
      status: "ok",
      resultAnswers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUserQuestions;
