const { getConnection } = require("../../db");

async function getQuestionsToAnswer(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //obtener las preguntas sin respuesta en los lenguages del experto
    //obtener los lenguages del experto

    const [result] = await connection.query(
      ` SELECT 
        Q.id,
        Q.title,
        Q.question_text,
        Q.date,
        U.name_user AS 'autor',
        U.avatar,
        LT.name_language
    FROM questions Q
    INNER JOIN users U ON Q.id_user = U.id 
    INNER JOIN languages_tech LT ON Q.id_language = LT.id
    WHERE status_question = false
    AND LT.id IN(SELECT id_language
                FROM users_languages
                WHERE id_user=?)
    ORDER BY Q.date DESC;
    `,
      [req.auth.id]
    );

    //buscar las respuestas en las preguntas
    for (const [i, question] of result.entries()) {
      if (question.status_question === 1) {
        const [answer] = await connection.query(
          `
      SELECT COUNT(id) AS 'count'
      FROM answers
      WHERE id_question=?
      `,
          [question.id]
        );
        result[i].answers = answer[0].count;
      } else {
        result[i].answers = 0;
      }
    }

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getQuestionsToAnswer;
