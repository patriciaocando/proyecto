const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");
const { loginUserSchema } = require("../../validator/userValidator");
const jsonwebtoken = require("jsonwebtoken");

async function loginUser(req, res, next) {
  let connection;
  try {
    await loginUserSchema.validateAsync(req.body);
    connection = await getConnection();

    //comprobar los datos enviados
    const { email, password } = req.body;

    const [dbUser] = await connection.query(
      `
      SELECT id, email, role, active
      FROM users
      WHERE email=? AND password=SHA2(?,512) AND active=true        
      `,
      [email, password]
    );

    if (dbUser.length === 0) {
      throw errorGenerator(
        `Email o password incorrectos, por favor verifica tus datos`,
        401
      );
    } else if (!dbUser[0].active) {
      throw errorGenerator(
        `EL usuario esta registrado pero no activado. Verifica tu email y activa tu cuenta`,
        401
      );
    }

    //gererar token-> contiene informacion confiable y fidedigna del usuario
    const tokenData = {
      id: dbUser[0].id,
      role: dbUser[0].role,
    };

    const token = jsonwebtoken.sign(tokenData, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.send({
      status: "ok",
      data: token,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
