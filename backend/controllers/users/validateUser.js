const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function validateUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { code } = req.params;

    const [result] = await connection.query(
      `
        SELECT email
        FROM users
        WHERE registration_code=?
      `,
      [code]
    );

    if (result.length === 0) {
      throw errorGenerator(`Codigo de registro vencido`, 404);
    }

    await connection.query(
      `
      UPDATE users
      SET active=1, registration_code=NULL
      WHERE registration_code=?
      `,
      [code]
    );

    res.send({
      status: "ok",
      message: `Usuario ${result[0].email} confirmado, Ya puedes hacer login en Tutorships`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validateUser;
