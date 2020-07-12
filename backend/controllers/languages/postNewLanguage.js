/* const { getConnection } = require("../../db");

const { newLanguageSchema } = require("../../validator/languagesValidator");

async function postNewLanguage(req, res, next) {
  let connection;
  try {
    await newLanguageSchema.validateAsync(req.body);

    connection = await getConnection();
    const { namelanguage, description } = req.body;

    const [newLanguage] = await connection.query(
      `
            INSERT INTO languages_tech(name_language,description, update_date,creation_date)
            VALUES("${namelanguage}","${description}",UTC_TIMESTAMP,UTC_TIMESTAMP)
            `
    );

    res.send({
      status: "ok",
      data: newLanguage[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postNewLanguage;
 */
