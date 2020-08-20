const { getConnection } = require("../../db");
const { errorGenerator, sendMail } = require("../../helpers");

async function userToExpert(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id_user } = req.params;
    const { languages } = req.body;
    const languagesId = languages.split(",");

    //Selecciono los datos del usuarioq ue quiere hacerse experto
    const [userToExpert] = await connection.query(
      `
    SELECT id,
    role,
    email
    FROM users
    WHERE id=?`,
      [id_user]
    );

    //compruebo que el usuario existe ne la bbdd
    if (userToExpert.length === 0) {
      throw errorGenerator(`EL usuario no existe en la base de datos`, 400);
    }

    //compruebo que no es un usurio experto
    if (userToExpert[0].role === "experto") {
      throw errorGenerator(`El usuario ya tiene el rol de Experto`, 403);
    }

    //actualizo su rol a experto
    await connection.query(
      `
      UPDATE users
      SET role="experto", last_auth_date=UTC_TIMESTAMP, update_date=UTC_TIMESTAMP
      WHERE id=?
      `,
      [id_user]
    );

    const languagesName = [];

    //recorro los lenguages para darlo de alta en la tabla users_experts y
    //saco los nombres de los lenguages de programacion
    for (const language of languagesId) {
      console.log(`language en bucle`, language);
      const [currentLanguageName] = await connection.query(
        `
      SELECT name_language
      FROM languages_tech
      WHERE id=?
       `,
        [language]
      );

      languagesName.push(currentLanguageName[0].name_language);

      await connection.query(
        `
      INSERT INTO users_languages(id_user, id_language,update_date, creation_date)
      VALUES ("${id_user}", "${language}", UTC_TIMESTAMP, UTC_TIMESTAMP)
      `
      );
    }

    //guardo los lenguages en un string
    const languagesStr = languagesName.join(",");

    //le envio un email para confirmar su alta
    try {
      await sendMail({
        email: userToExpert[0].email,
        title: `Tutorships Ahora eres un experto`,
        content: `Ahora eres un usuario Experto en los lenguages ${languagesStr}... con un gran poder viene una gran responsabilidad... Be wise young Padawan.
      Haz login de nuevo para activar tu nuevo rol
        
          `,
      });
    } catch (error) {
      throw errorGenerator(
        `Error en el envio de email por favor intentalo de nuevo`,
        400
      );
    }

    res.send({
      status: "ok",
      Message: `Has dado de alta como experto al usuario ${userToExpert[0].id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = userToExpert;
