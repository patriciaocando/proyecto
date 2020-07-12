const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { resetPasswordSchema } = require("../../validator/userValidator");

async function resetUserPassword(req, res, next) {
  let connection;
  try {
    await resetPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { recoverCode, newPassword } = req.body;
    const [currentUser] = await connection.query(
      `
       SELECT id, password
       FROM users
       WHERE password_code=?`,
      [recoverCode]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(
        `No hay ningun usuario con este codigo de recuperacion`
      );
    }

    await connection.query(
      `
    UPDATE users
    SET password=SHA2(?,512), password_code=NULL, last_auth_date=UTC_TIMESTAMP, update_date=UTC_TIMESTAMP
    WHERE id=?
    `,
      [newPassword, currentUser[0].id]
    );

    res.send({
      status: "ok",
      message: "Se ha cambiado tu contrasenia",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = resetUserPassword;
