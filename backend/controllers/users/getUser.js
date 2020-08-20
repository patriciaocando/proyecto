const { getConnection } = require("../../db");
const { errorGenerator } = require("../../helpers");

async function getUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    const [currentUser] = await connection.query(
      `
      SELECT
      id,
        username,
        name_user,
        last_name,
        email,
        profile_bio,
        avatar, 
        role,
        password
       FROM users
       WHERE id=? 
      `,
      [id]
    );

    if (currentUser.length === 0) {
      throw errorGenerator(
        `EL usuario con el id ${id} no esxiste en base de datos`,
        404
      );
    }

    const [userInfo] = currentUser;

    const userData = {
      id: userInfo.id,
      username: userInfo.username,
      avatar: userInfo.avatar,
      role: userInfo.role,
      name: userInfo.name_user,
      password: userInfo.password,
    };

    if (userInfo.id === req.auth.id || req.auth.role === "admin") {
      userData.id = userInfo.id;
      userData.email = userInfo.email;
      userData.profile = userInfo.profile_bio;
      userData.name = userInfo.name_user;
      userData.lastName = userInfo.last_name;
      userData.password = userInfo.password;
    }

    res.send({
      status: "ok",
      data: userData,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
