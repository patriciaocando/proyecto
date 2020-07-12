const { getConnection } = require("../../db");
const { sendMail, errorGenerator } = require("../../helpers");

async function upgradeUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { languages } = req.body;

    //traer info del usuario
    const [currentUser] = await connection.query(
      `
      SELECT email,
      name_user,
      last_name,
      username,
      role
      FROM users
      WHERE id=?
    `,
      [req.auth.id]
    );

    //comprar si el usuario existe ne la base de datos
    if (currentUser.length === 0) {
      throw errorGenerator(`El usuario  no existe ne la base de datos`, 404);
    }

    //comprobar que no es un usuario experto
    if (currentUser[0].role === "experto") {
      throw errorGenerator(`Ya eres un usuario experto`, 403);
    }

    //Array para guardar los nombres de los lenguages
    const languagesName = [];

    //Verificar que los lenguages existen en la base de datos
    for (const language of languages) {
      const [currentLanguage] = await connection.query(
        `
      SELECT id,
      name_language
      FROM languages_tech
      WHERE id=?
       `,
        [language]
      );
      if (currentLanguage.length === 0) {
        throw errorGenerator(
          `El lenguage con el id ${language} no existe en la base de datos`,
          400
        );
      } else {
        languagesName.push(currentLanguage[0].name_language);
      }
    }

    //guardo los lenguages en un string
    const languagesStr = languages.join(",");

    //buscar el email del usuario administrador
    const [adminInfo] = await connection.query(`
      SELECT email
      FROM users
      WHERE role="admin"
      `);

    //users/validate-expert/:id/:languages
    const validationURL = `${process.env.PUBLIC_HOST}/users/validate-expert/${req.auth.id}/${languagesStr}`;
    const languagesNameStr = languagesName.join(",");

    try {
      await sendMail({
        email: adminInfo[0].email,
        title: `Solicitud de experto`,
        content: `El usuario con el id ${req.auth.id} ha solicitado convertirse a Experto.
         Email: ${currentUser[0].email}
         username: ${currentUser[0].username}
         Lenguajes: ${languagesNameStr}.
         Haz click aqui para darlo de alta:
         ${validationURL}
        
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
      message: `Se ha enviado tu solicitud al administrador de Tutorships`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = upgradeUser;
