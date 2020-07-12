const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function addUserLanguage(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { newlanguage } = req.body;

    //verificar los lenguages existentes y si el id del lenguage que se desea asociar existe
    const [existingLanguages] = await connection.query(
      `
    SELECT id
    FROM languages_tech
    WHERE id=?
    `,
      [newlanguage]
    );

    if (existingLanguages.length === 0) {
      throw errorGenerator(
        `El lenguage que deseas asociar no existe en la base de datos`,
        403
      );
    }

    //verificar que el usuario existe en la base de datos
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

    //verificar si el usuario  no esta dadod e alta en el lenguage que solicita
    const [currentLanguages] = await connection.query(
      `
    SELECT id_language
    FROM users_languages
    WHERE id_user=?
      `,
      [req.auth.id]
    );

    for (const language of currentLanguages) {
      if (language.id_language === newlanguage) {
        throw errorGenerator(
          `EL usuario ya esta asociado al lenguage ${language.id_language}`,
          400
        );
      }
    }

    //asociarlo al lenguage
    await connection.query(
      `
      INSERT INTO users_languages(id_user, id_language,update_date, creation_date)
      VALUES ("${req.auth.id}", "${newlanguage}", UTC_TIMESTAMP, UTC_TIMESTAMP)
      `
    );

    res.send({
      status: "ok",
      message: `Has asociado tu perfil al lenguage ${newlanguage}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = addUserLanguage;
