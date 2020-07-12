const { errorGenerator } = require("../helpers");

async function isAdmin(req, res, next) {
  try {
    if (req.auth.role === "admin") {
      next();
    } else {
      throw errorGenerator(
        `Solo el Administrador puede realizar esta accion`,
        403
      );
    }
  } catch (error) {
    next(error);
  }
}

module.exports = isAdmin;
