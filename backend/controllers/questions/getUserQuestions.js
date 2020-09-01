const { getConnection } = require("../../db");
//const { errorGenerator } = require("../../helpers");

async function getUserQuestions(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    console.log(req.auth.id);

    //BUSCO LA PREGUNTA
    const [result] = await connection.query(
      `
        SELECT 
        Q.id AS 'id', 
        Q.title, 
        Q.question_text, 
        Q.date, 
        Q.status_question,
        COALESCE(U.name_user, U.username) AS 'name_user', 
        U.avatar, 
        LT.name_language,
        COUNT(A.id_question) AS 'answers'
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id
    INNER JOIN languages_tech LT ON Q.id_language=LT.id
    LEFT JOIN answers A ON A.id_question = Q.id
    WHERE Q.id_user=?
    GROUP BY Q.id
    ORDER BY Q.date DESC;
      `,
      [req.auth.id]
    );

    /*  if (result.length === 0) {
      throw errorGenerator(`No has hecho ninguna pregunta aun`, 400);
    } */

    /*     let resultAnswers = [];
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
    } */

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

module.exports = getUserQuestions;
