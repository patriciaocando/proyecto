const { getConnection } = require("../db");
const { errorGenerator } = require("../helpers");

async function answerExist(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_answer } = req.params;

    //verifico que la pregunta existe
    const [currentQuestion] = await connection.query(
      `
      SELECT id 
      FROM answers
      WHERE id=?
`,
      [id_answer]
    );

    if (currentQuestion.length === 0) {
      throw errorGenerator(
        `La respuesta con el id ${id_answer} no existe en la base de datos`,
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

module.exports = answerExist;
