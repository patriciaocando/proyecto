const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getExpertLanguages(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //compruebo que el usuario existe ne la bbdd
    const [currentUser] = await connection.query(
      `
    SELECT id
    FROM users
    WHERE id=?`,
      [req.auth.id]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(`EL usuario no existe en la base de datos`, 400);
    }

    //Listo los lenguages en los que el usuario es experto
    const [result] = await connection.query(
      `
     SELECT
     LT.id,
        LT.name_language AS 'language',
        LT.description,
        LT.image
    FROM users U
    INNER JOIN users_languages UL ON U.id=UL.id_user
    INNER JOIN languages_tech LT ON UL.id_language=LT.id
    WHERE U.id=?;   
      `,
      [req.auth.id]
    );

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getExpertLanguages;
