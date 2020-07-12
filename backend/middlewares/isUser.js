const { getConnection } = require("../db");
const jsonwebtoken = require("jsonwebtoken");
const { errorGenerator } = require("../helpers");

async function isUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { authorization } = req.headers;

    if (!authorization) {
      throw errorGenerator(`Falta el codigo de autorizacion`, 401);
    }

    //comprobar que el token es  valido y decodificarlo
    let tokenData;
    try {
      tokenData = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw errorGenerator(`El token no es valido`, 401);
    }

    //Saco la fecha de la ultima vez que el usuario cambio su contrasenia
    const [result] = await connection.query(
      `
    SELECT last_auth_date
    FROM users
    WHERE id=?
    `,
      [tokenData.id]
    );

    if (result.length === 0) {
      throw errorGenerator(`EL usuario no existe en la base de datos`, 401);
    }

    //converir las fechas a fechas de javascript
    const tokenCreationDate = new Date(tokenData.iat * 1000);
    const userLastAuthUpdate = new Date(result[0].last_auth_date);

    if (userLastAuthUpdate > tokenCreationDate) {
      throw errorGenerator(
        `EL token ya no es valido. Haz login nuevamente`,
        401
      );
    }

    //Meter la informacion del usuario en el objeto request
    req.auth = tokenData;

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
