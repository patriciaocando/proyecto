const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getSingleQuestion(req, res, next) {
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
        U.name_user, 
        U.avatar, 
        LT.name_language
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    WHERE Q.id=?
    ORDER BY Q.date DESC;
      `,
      [id_question]
    );

    if (result.length === 0) {
      throw errorGenerator(
        `La pregunta con el id ${id_question} existe ne la base de datos`,
        404
      );
    }

    //buscar las respuestas en las preguntas
    if (result[0].status_question === 1) {
      const [answer] = await connection.query(
        `
      SELECT COUNT(id) AS 'count'
      FROM answers
      WHERE id_question=?
      `,
        [id_question]
      );
      result[0].answers = answer[0].count;
    } else {
      result[0].answers = 0;
    }

    res.send({
      status: "ok",
      data: result[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getSingleQuestion;
