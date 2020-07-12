const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getAnsweredQuestion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id_question } = req.params;

    const [result] = await connection.query(
      `
        SELECT 
        Q.id, 
        Q.title, 
        Q.question_text, 
        Q.date, 
        Q.status_question,
        U.name_user AS 'Autor', 
        U.avatar, 
        LT.name_language AS 'Language'
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    WHERE Q.id=? AND Q.status_question=1
    ORDER BY Q.date DESC;
      `,
      [id_question]
    );

    if (result.length === 0) {
      throw errorGenerator(
        `La pregunta con el id ${id_question} no ha sido respondida`,
        404
      );
    }

    const [answer] = await connection.query(
      `
        SELECT
            A.id AS 'id',
            A.answer_text AS 'Answer',
            A.date_answer AS 'date',
            A.id_question,
            A.id_user_expert,
            U.name_user AS 'Expert',
            U.avatar,
            LT.name_language AS 'Language',
            AVG(UR.rating) AS 'rating'
        FROM answers A
        INNER JOIN questions Q ON A.id_question = Q.id
        INNER JOIN users U ON A.id_user_expert=U.id
        INNER JOIN languages_tech LT ON Q.id_language=LT.id
        INNER JOIN users_rating UR ON A.id=UR.id_answer
        WHERE A.id_question = ?
        GROUP BY A.id;
      `,
      [id_question]
    );

    res.send({
      status: "ok",
      question: result[0],
      answer,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getAnsweredQuestion;
