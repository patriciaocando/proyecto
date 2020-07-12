const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function deleteUserLanguage(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { language } = req.body;

    //verificar que el usuario existe ne la base de datos
    const [currentUser] = await connection.query(
      `
    SELECT id, role
    FROM users
    WHERE id=?`,
      [req.auth.id]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(`EL usuario no existe en la base de datos`, 400);
    }

    //verificar los lenguages existentes y si el id del lenguage que se desea asociar existe
    const [currentLanguage] = await connection.query(
      `
    SELECT id
    FROM languages_tech
    WHERE id=?
    `,
      [language]
    );

    if (currentLanguage.length === 0) {
      throw errorGenerator(
        `El lenguage al que te refieres no existe en la base de datos`,
        403
      );
    }

    const [userLanguage] = await connection.query(
      `
    SELECT id_language
    FROM users_languages
    WHERE id_user=? AND id_language=?
      `,
      [req.auth.id, language]
    );

    if (userLanguage.length === 0) {
      throw errorGenerator(
        `EL usuario no tiene el lenguage ${language} asociado`,
        400
      );
    }

    await connection.query(
      `
    DELETE FROM users_languages
    WHERE id_user=? AND id_language=?
      `,
      [req.auth.id, language]
    );

    res.send({
      status: "ok",
      message: `Tu perfil ya no esta asociado al lenguage ${language}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUserLanguage;
