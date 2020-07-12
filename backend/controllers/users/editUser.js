const { getConnection } = require("../../db");
const { editUserSchema } = require("../../validator/userValidator");
const {
  errorGenerator,
  processImage,
  sendMail,
  randomCodeString,
} = require("../../helpers");

async function editUser(req, res, next) {
  let connection;

  try {
    await editUserSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id } = req.params;
    const { name, last_name, username, profile_bio, email } = req.body;

    // verificar que tiene permiso para editar el perfil de usuario
    if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
      throw errorGenerator(`No tienes permisos para editar ester perfil`, 403);
    }

    //traer info del usuario
    const [currentUser] = await connection.query(
      `
      SELECT id, email, avatar
      FROM users
      WHERE id=?
    `,
      [id]
    );

    //comprar si el usuario existe ne la base de datos
    if (currentUser.length === 0) {
      throw errorGenerator(
        `El usuario con el id ${id} no existe ne la base de datos`,
        404
      );
    }

    let userAvatar;
    let avatar = false;
    if (req.files && req.files.avatar) {
      try {
        userAvatar = await processImage(req.files.avatar);
        avatar = true;
      } catch (error) {
        throw errorGenerator(
          `No hemos podido procesar la imagen, por favor intentalo de nuevo`,
          400
        );
      }
    } else {
      userAvatar = currentUser[0].avatar;
      avatar = true;
    }

    //creo un mensaje para la respues
    let sendMessage = "Usuario actualizado";

    let sqlQuery = `UPDATE users`;
    const sqlParams = [];

    if (name || last_name || username || profile_bio || email || avatar) {
      const conditions = [];

      if (name) {
        conditions.push(`name_user=?`);
        sqlParams.push(`${name}`);
      }

      if (last_name) {
        conditions.push(`last_name=?`);
        sqlParams.push(`${last_name}`);
      }

      if (username) {
        conditions.push(`username=?`);
        sqlParams.push(`${username}`);
      }

      if (profile_bio) {
        conditions.push(`profile_bio=?`);
        sqlParams.push(`${profile_bio}`);
      }

      if (email) {
        if (email !== currentUser[0].email) {
          const [existingEmail] = await connection.query(
            `
        SELECT id
        FROM users
        WHERE email=?
        `,
            [email]
          );

          //verificar el nuevo email
          if (existingEmail.length > 0) {
            throw errorGenerator(
              `El email ya existe en la base de datos, por favor ingresa otro email`,
              403
            );
          }

          // se genera un codigo aleatroreo GLOBAL para poder utilizarlo par ala generacion de la query
          const userCode = randomCodeString(40);

          //se crea una url para confirmar el codigo
          const validationURL = `${process.env.PUBLIC_HOST}/users/validate/${userCode}`;

          try {
            await sendMail({
              email,
              title: "Tutorships - Cambio de email",
              content: `Haz click en el enlace para confirmar tu cambio de email ${validationURL}`,
            });
          } catch (error) {
            throw errorGenerator(`Error en el envio de mail`, 500);
          }

          sendMessage = "Tutorships - Confirma tu nuevo email";
          conditions.push(
            `email=?, active=false, registration_code=?, last_auth_date=UTC_TIMESTAMP`
          );
          sqlParams.push(`${email}`);
          sqlParams.push(`${userCode}`);
        }
      }

      if (avatar) {
        conditions.push(`avatar=?`);
        sqlParams.push(`${userAvatar}`);
      }
      conditions.push(`update_date=UTC_TIMESTAMP`);
      sqlParams.push(Number(id));

      sqlQuery = `${sqlQuery} SET ${conditions.join(", ")} WHERE id=?`;
    }

    await connection.query(`${sqlQuery}`, sqlParams);

    res.send({
      status: "ok",
      message: sendMessage,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editUser;
