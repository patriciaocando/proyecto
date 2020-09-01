const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getAllAnsweredQuestion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      ` SELECT 
        Q.id,
        Q.title, 
        Q.question_text AS 'Question', 
        Q.date,         
        U.name_user AS 'Autor',
        U.avatar, 
        LT.name_language AS 'Language'
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    WHERE status_question = true
    ORDER BY Q.date DESC;
    `
    );

    if (result.length === 0) {
      throw errorGenerator(`No hay preguntas para mostrar`, 404);
    }

    const questionId = result.map((question) => {
      return question.id;
    });

    let resultAnswers = [];
    let count = 0;
    for (const id of questionId) {
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
               COALESCE((SUM(UR.rating)/(COUNT(UR.id_answer)-1)) , 0) AS 'rating',
        FROM answers A
        INNER JOIN questions Q ON A.id_question = Q.id
        INNER JOIN users U ON A.id_user_expert=U.id
        INNER JOIN languages_tech LT ON Q.id_language=LT.id
        INNER JOIN users_rating UR ON A.id=UR.id_answer
        WHERE A.id_question = ?
        GROUP BY A.id;
      `,
        [id]
      );

      resultAnswers.push({
        question: result[count++],
        answer: answer,
      });
    }

    res.send({
      status: "ok",
      data: resultAnswers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getAllAnsweredQuestion;
