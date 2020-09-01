const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { ratingAnswerSchema } = require("../../validator/answersValidators");

async function postAnswerRating(req, res, next) {
  let connection;
  try {
    await ratingAnswerSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id_answer } = req.params;
    const { rating } = req.body;

    //Comprobar que existe la pregunta
    const [existingAnswer] = await connection.query(
      `
      SELECT id
      FROM answers
      WHERE id=?`,
      [id_answer]
    );

    if (existingAnswer.length === 0) {
      throw errorGenerator(`No existe la pregunta ${id_answer}`, 403);
    }

    //compruebo que no hay mas votos del mismo usuario
    const [existingVote] = await connection.query(
      `
      SELECT id_user
      FROM users_rating
      WHERE id_user=? AND id_answer=?`,
      [req.auth.id, id_answer]
    );

    //compruebo que no ha votado la misma pregunta anteriormente
    if (existingVote.length > 0) {
      throw errorGenerator(`Ya has rankeado esta pregunta`, 403);
    }

    await connection.query(
      `
      INSERT INTO users_rating
        (id_user,
        id_answer,
        rating,
        update_date,
        creation_date)
      VALUES(?,?,?,UTC_TIMESTAMP,UTC_TIMESTAMP)`,
      [req.auth.id, id_answer, rating]
    );

    res.send({
      status: "ok",
      message: `Has rankeado la pregunta ${id_answer} con ${rating}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postAnswerRating;
