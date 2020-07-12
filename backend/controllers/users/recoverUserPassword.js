const { getConnection } = require("../../db");
const { errorGenerator, randomCodeString, sendMail } = require("../../helpers");
const { recoverPasswordSchema } = require("../../validator/userValidator");

async function recoverUserPassword(req, res, next) {
  let connection;
  try {
    await recoverPasswordSchema.validateAsync(req.body);

    connection = await getConnection();

    const { email } = req.body;
    const [currentUser] = await connection.query(
      `
       SELECT email
       FROM users
       WHERE email=?`,
      [email]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(`El usuario no existe en la base de datos`, 400);
    }

    const recoverCode = randomCodeString(40);

    await connection.query(
      `
      UPDATE users
      SET password_code=?
      WHERE email=?      
      `,
      [recoverCode, email]
    );

    try {
      sendMail({
        email,
        title: "Tutorships - Reset de password",
        content: `Este es el codifo para resetear tu password ${recoverCode}.
        Si no has sido tu, ignora este email. Todo bien`,
      });
    } catch (error) {
      throw errorGenerator(`Error en el envio de email`, 500);
    }

    res.send({
      status: "ok",
      message: "Hemos enviado el codigo de reseto a tu email.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = recoverUserPassword;
