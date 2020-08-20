const { getConnection } = require("../../db");
//const { errorGenerator } = require("../../helpers");

async function getAnswersQuestion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_question } = req.params;

    const [answers] = await connection.query(
      `
    SELECT 
     A.id AS 'id',
        A.answer_text AS 'answer',
        A.date_answer AS 'respond',
        A.id_question,
        U.name_user AS 'expert',
        A.id_user_expert AS 'id_expert',
        U.avatar AS 'avatarExpert',
        LT.name_language AS 'language',
        AVG(UR.rating) AS 'rating',
        COUNT(UR.id_answer) AS 'total_votes'
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
      data: answers,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getAnswersQuestion;
