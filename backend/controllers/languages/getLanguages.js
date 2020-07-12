const { getConnection } = require("../../db");

async function getLanguages(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT
        id,
        name_language,
        description,
        image
    FROM languages_tech; 
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

module.exports = getLanguages;
