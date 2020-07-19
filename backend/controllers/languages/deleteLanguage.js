const { getConnection } = require("../../db.js");
const { errorGenerator } = require("../../helpers.js");

async function deleteLanguage(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id_language } = req.params;

    //revisar si el lenguage existe
    const [currentLanguage] = await connection.query(
      `
        SELECT id, name_language
        FROM languages_tech
        WHERE id=?`,
      [id_language]
    );

    if (currentLanguage.length === 0) {
      throw errorGenerator(
        `El lenguage que quieres borrar no existe en la bbdd`,
        400
      );
    }
    //revisar si el lenguage tiene pregunras asociadas-> si tiene no se puede borrar
    const [questionsOfCurrentLanguage] = await connection.query(
      `
    SELECT id
    FROM questions
    WHERE id_language=?
      `,
      [id_language]
    );

    if (questionsOfCurrentLanguage.length > 0) {
      throw errorGenerator(
        `Hay ${questionsOfCurrentLanguage.length} preguntas asociadas al lenguage ${currentLanguage[0].name_language} No puedes borrar este lenguage`,
        403
      );
    }

    await connection.query(
      `
      DELETE FROM languages_tech
      WHERE id=?
      `,
      [id_language]
    );

    res.send({
      status: "ok",
      message: `Has borrado el lenguage con el id ${id_language}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release;
  }
}

module.exports = deleteLanguage;
