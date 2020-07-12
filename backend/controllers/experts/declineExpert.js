const { getConnection } = require("../../db");
const { errorGenerator, sendMail } = require("../../helpers");

async function declineExpert(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    //Selecciono los datos del usuario que quiere hacerse estudiante
    const [userToExpert] = await connection.query(
      `
    SELECT
    id,
    role,
    email
    FROM users
    WHERE id=?`,
      [req.auth.id]
    );

    //compruebo que el usuario existe en la bbdd
    if (userToExpert.length === 0) {
      throw errorGenerator(`EL usuario no existe en la base de datos`, 400);
    }

    //compruebo que no es un usurio estudiante
    if (userToExpert[0].role === "estudiante") {
      throw errorGenerator(`El usuario ya tiene el rol de estudiante`, 403);
    }

    //reviso en que idiomas esta dado de alta el usuario
    await connection.query(
      `
      DELETE FROM users_languages
      WHERE id_user=?`,
      [req.auth.id]
    );

    //actualizo su rol a estudiante
    await connection.query(
      `
      UPDATE users
      SET role="estudiante", last_auth_date=UTC_TIMESTAMP, update_date=UTC_TIMESTAMP
      WHERE id=?
      `,
      [req.auth.id]
    );

    //le envio un email para confirmar su alta
    try {
      await sendMail({
        email: userToExpert[0].email,
        title: `Tutorships Ahora eres un estudiante`,
        content: `Ahora eres un usuario Estudiante: la humildad tambien es sabiduria. Haz login de nuevo para activar tu nuevo rol`,
      });
    } catch (error) {
      throw errorGenerator(
        `Error en el envio de email por favor intentalo de nuevo`,
        400
      );
    }

    res.send({
      status: "ok",
      data: `Ahora eres un usuario Estudiante`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = declineExpert;
