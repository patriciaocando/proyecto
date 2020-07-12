const { getConnection } = require("../db");
const { errorGenerator } = require("../helpers");

async function questionExist(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_question } = req.params;

    //verifico que la pregunta existe
    const [currentQuestion] = await connection.query(
      `
      SELECT id, status_question 
      FROM questions
      WHERE id=?
`,
      [id_question]
    );

    if (currentQuestion.length === 0) {
      throw errorGenerator(
        `La pregunta con el id ${id_question} no existe en la base de datos`,
        404
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = questionExist;
