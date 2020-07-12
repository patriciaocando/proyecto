const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { editQuestionSchema } = require("../../validator/questionsValidators");

async function editQuestion(req, res, next) {
  let connection;
  try {
    await editQuestionSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id_question } = req.params;
    const { title, content } = req.body;

    //Saco los datos de la pregunta solicitada
    //Editar la pregunta
    const [currentQuestion] = await connection.query(
      `SELECT 
        Q.id,
        Q.title,
        Q.question_text,
        Q.date,
        Q.id_user,
        U.name_user AS 'Autor',
        U.avatar,
        Q.id_language,
        LT.name_language AS 'Language'
    FROM questions Q
    INNER JOIN users U ON Q.id_user = U.id 
    INNER JOIN languages_tech LT ON Q.id_language = LT.id
    WHERE Q.id=?`,
      [id_question]
    );
    //verificar que el id del autor o el rol de usuario
    if (
      currentQuestion[0].id_user !== req.auth.id &&
      req.auth.role !== "admin"
    ) {
      throw errorGenerator(`No tienes permisos para editar esta pregunta`, 403);
    } else {
      //Editar la pregunta
      await connection.query(
        `
      UPDATE questions
      SET title=?, question_text=?, update_date=UTC_TIMESTAMP
      WHERE id=?
      `,
        [title, content, id_question]
      );

      res.send({
        status: "ok",
        message: `Has editado la pregunta ${id_question}`,
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editQuestion;
