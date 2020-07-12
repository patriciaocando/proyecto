const { getConnection } = require("../../db");
const { randomCodeString, sendMail, errorGenerator } = require("../../helpers");
const { newUserSchema } = require("../../validator/userValidator");

async function newUser(req, res, next) {
  let connection;
  try {
    await newUserSchema.validateAsync(req.body);

    connection = await getConnection();
    const { username, email, password } = req.body;

    //se verifica si ya existe un usuario con el email que ingresa el usuario
    const [userExist] = await connection.query(
      `
        SELECT id, username
        FROM users
        WHERE email=?        
      `,
      [email]
    );

    if (userExist.length > 0) {
      throw errorGenerator(
        `Ya existe un usuario con este email, por favor ingresa un email diferente`,
        409
      );
    }

    //se verifica si ya existe un usuario con el nombre de usuario que ingresa el usuario
    const [usernameExist] = await connection.query(
      `
        SELECT id 
        FROM users
        WHERE username=?        
      `,
      [username]
    );
    console.log(userExist);

    if (usernameExist.length > 0) {
      throw errorGenerator(
        `El nombre de usuario ya existe, por favor prueba uno diferente`,
        400
      );
    }

    // se genera un codigo aleatroreo
    const userCode = randomCodeString(40);
    //se crea una url para confirmar el codigo
    const validationURL = `${process.env.PUBLIC_HOST}/users/validate/${userCode}`;

    //Se envia un email con la URL de confirmacion
    try {
      await sendMail({
        email,
        title: "Tutorships - Confirmacion de registro",
        content: `Haz click en el enlace para confirmar tu registro ${validationURL}`,
      });
    } catch (error) {
      throw errorGenerator("Error en el envio de mail", 500);
    }

    //meter en nuevo usuario en la base de datos sin activar
    await connection.query(
      `
      INSERT INTO users(email, password, username, registration_code, role, update_date, creation_date)
      VALUES(?,SHA2(?,512),?,?, 'estudiante', UTC_TIMESTAMP,UTC_TIMESTAMP)`,
      [email, password, username, userCode]
    );

    res.send({
      status: "ok",
      message: `Usuario registrado. Confirma tu email para activar tu cuenta en Tutorships. Recuerda revisar un carpeta de SPAM`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
