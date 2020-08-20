const { getConnection } = require("../../db");

async function getSingleQuestion(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        
      `
    );

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

module.exports = getSingleQuestion;

/* if (result.length === 0) {
  const error = new Error(``);
  error.httpStatus = 404;
  throw error;
} */

/* 
await connection.query("DELETE FROM users_languages;");
await connection.query("DELETE FROM users_rating;");
await connection.query("DELETE FROM answers;");
await connection.query("DELETE FROM questions;");
await connection.query("DELETE FROM languages_tech;");
await connection.query("DELETE FROM users;");

await connection.query("ALTER TABLE users_languages  AUTO_INCREMENT = 1;");
await connection.query("ALTER TABLE users_rating  AUTO_INCREMENT = 1;");
await connection.query("ALTER TABLE answers  AUTO_INCREMENT = 1;");
await connection.query("ALTER TABLE questions  AUTO_INCREMENT = 1;");
await connection.query("ALTER TABLE languages_tech  AUTO_INCREMENT = 1;");
await connection.query("ALTER TABLE users  AUTO_INCREMENT = 1;");
 */
