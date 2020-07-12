const { getConnection } = require("../../db");
const { errorGenerator, deleteFile } = require("../../helpers");

async function deleteUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;
    const idTutorshipUser = 2;

    //Busco el id en la bbdd para verficar que si existe
    const [currentUser] = await connection.query(
      `
      SELECT id, avatar, role
      FROM users
      WHERE id=?        
      `,
      [id]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(`No existe el usuario en la base de datos`, 400);
    }

    //si tiene avatar la borro
    if (currentUser[0].avatar) {
      await deleteFile(currentUser[0].avatar);
    }

    if (currentUser[0].id === 2 || currentUser[0].id === 1) {
      throw errorGenerator(`No puedes borrar este usuario`, 403);
    }

    //Si es un usuario estudiante le asigno las preguntas que haya hecho a tutorshipsUser
    //y si es un usuario experto le asigno los lenguages, las respuestas, las preguntas
    //En el orden en el que las claves foraneas lo permiten

    let sendMessaje;
    if (currentUser[0].role === "estudiante") {
      //Borro los datos de la tabla botos
      await connection.query(
        `
        DELETE FROM users_rating
        WHERE id_user=?`,
        [id]
      );

      await connection.query(
        `
      UPDATE questions
      SET id_user=?
      WHERE id_user=?
      `,
        [idTutorshipUser, id]
      );
      await connection.query(
        `
      DELETE FROM users
      WHERE id=?
      `,
        [id]
      );

      sendMessaje = `El usuario con el id ${id} se ha borrado de Tutorships.Sus preguntas han sido asignadas a Tutorships User.`;
    } else if (currentUser[0].role === "experto") {
      await connection.query(
        `
      DELETE FROM users_languages
      WHERE id_user=?
      `,
        [id]
      );
      console.log(`Borrado user-language`);

      //Borro los datos de la tabla botos
      await connection.query(
        `
        DELETE FROM users_rating
        WHERE id_user=?`,
        [id]
      );
      console.log(`Borrado user-rating`);

      await connection.query(
        `
      UPDATE answers
      SET id_user_expert=?
      WHERE id_user_expert=?
      `,
        [idTutorshipUser, id]
      );

      console.log(`actualizadas respuestas`);

      await connection.query(
        `
      UPDATE questions
      SET id_user=?
      WHERE id_user=?
      `,
        [idTutorshipUser, id]
      );

      console.log(`actualizadas preguntas`);

      await connection.query(
        `
      DELETE FROM users
      WHERE id=?
      `,
        [id]
      );

      sendMessaje = `El usuario experto con el id ${id} se ha borrado de Tutorships. Sus respuestas y preguntas han sido asignadas a Tutorships.`;
    }

    res.send({
      status: "ok",
      message: sendMessaje,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;
