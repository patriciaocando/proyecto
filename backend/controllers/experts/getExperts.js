const { getConnection } = require("../../db");

async function getExpertos(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT
        U.id,
        U.name_user,
        U.last_name,
        U.avatar,
        LT.name_language
    FROM users U
    INNER JOIN users_languages UL ON U.id=UL.id_user
    INNER JOIN languages_tech LT ON UL.id_language=LT.id
    WHERE U.role="experto" AND U.id>2;
      `);

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

module.exports = getExpertos;
