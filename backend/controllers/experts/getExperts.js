const { getConnection } = require("../../db");

async function getExpertos(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT
        U.id,
        U.username,
        U.avatar,
        U.profile_bio,
        U.creation_date  
    FROM users U
    WHERE U.role="experto" AND U.id>2;
      `);

    const expertId = result.map((expert) => {
      return expert.id;
    });

    let expertResult = [];
    let count = 0;
    //Listo los lenguages en los que el usuario es experto
    for (const id of expertId) {
      const [language] = await connection.query(
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
        [id]
      );

      expertResult.push({
        expert: result[count++],
        language,
      });
    }

    res.send({
      status: "ok",
      data: expertResult,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getExpertos;
