const { errorGenerator } = require("../helpers");

async function isExpert(req, res, next) {
  try {
    console.log("req", req);
    console.log("req.auth", req.auth);
    console.log("req.auth.role", req.auth.role);
    if (req.auth.role === "experto" || req.auth.role === "admin") {
      next();
    } else {
      throw errorGenerator(
        `Debes ser un usuario Experto para realizar esta accion`,
        403
      );
    }
  } catch (error) {
    next(error);
  }
}

module.exports = isExpert;
