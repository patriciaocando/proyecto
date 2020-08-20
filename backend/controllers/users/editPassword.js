const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { editPasswordSchema } = require("../../validator/userValidator");

async function editPassword(req, res, next) {
  let connection;
  try {
    await editPasswordSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // verificar que tiene permiso para editar la contrasenia
    if (req.auth.id !== Number(id)) {
      throw errorGenerator(
        `No tienes permisos para cambiar esta contraseña`,
        403
      );
    }

    //Verificar que la contrasenia nueva no es igual a la actual
    if (currentPassword === newPassword) {
      throw errorGenerator(
        `La password nueva no puede ser igual a la anterior`,
        400
      );
    }
    //Verificar que el usuario existe en la bbdd
    const [currentUser] = await connection.query(
      `
      SELECT id 
      FROM users
      WHERE id=? AND password=SHA2(?,512)
        
      `,
      [id, currentPassword]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(
        `No coincide tu contraseña actual, intenta de nuevo`,
        401
      );
    }

    await connection.query(
      `
    UPDATE users
    SET password=SHA2(?,512), update_date=UTC_TIMESTAMP, last_auth_date= UTC_TIMESTAMP
    WHERE id=? AND password=SHA2(?,512)
      `,
      [newPassword, id, currentPassword]
    );

    res.send({
      status: "ok",
      data: "Has actualizado tu nueva contaseña",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editPassword;
