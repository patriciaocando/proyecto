const { getConnection } = require("../../db");
const { postQuestionSchema } = require("../../validator/questionsValidators");

async function postQuestion(req, res, next) {
  let connection;
  try {
    await postQuestionSchema.validateAsync(req.body);
    connection = await getConnection();
    const { title, content, language } = req.body;
    const user = req.auth.id;

    //verificar el id del lenguage
    const [questionidLanguaje] = await connection.query(
      `
    SELECT id
    FROM languages_tech
    WHERE name_language=?`,
      [language]
    );

    //verificar que no existe una pregunta con el mismo ID??
    const [result] = await connection.query(
      `INSERT INTO questions
        (title, 
        question_text, 
        date, 
        id_user,
        id_language,
        update_date, creation_date)
        values(?,?,UTC_TIMESTAMP,?,?, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `,
      [title, content, user, questionidLanguaje[0].id]
    );

    res.send({
      status: "ok",
      data: {
        ID: result.insertId,
        title,
        content,
        language,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postQuestion;
