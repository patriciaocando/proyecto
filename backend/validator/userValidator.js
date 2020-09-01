const Joi = require("@hapi/joi");
const { errorGenerator } = require("../helpers");

const newUserSchema = Joi.object().keys({
  username: Joi.string()
    .min(4)
    .required()
    .error(
      errorGenerator(
        `Debes ingresar un nombre de usuario de minimo 8 caracteres`,
        400
      )
    ),
  email: Joi.string()
    .email()
    .required()
    .error(errorGenerator(`Debes ingresar un email valido`, 400)),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      errorGenerator(`Debes ingresar un password de minimo 8 caracteres`, 400)
    ),
});

const loginUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(errorGenerator(`Debes ingresar un email valido`, 400)),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      errorGenerator(`Debes ingresar un password de minimo 8 caracteres`, 400)
    ),
});

const editUserSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(20)
    .error(errorGenerator(`Tu nombre debe tener maximo 20 caracteres`, 400)),
  last_name: Joi.string()
    .min(3)
    .max(20)
    .error(errorGenerator(`Tu apellido debe tener maximo 20 caracteres`, 400)),
  username: Joi.string()
    .min(5)
    .max(20)
    .error(
      errorGenerator(`Tu nombre de usuario debe tener minimo 5 caracteres`, 400)
    ),
  profile_bio: Joi.string()
    .min(3)
    .max(250)
    .error(
      errorGenerator(`Tu biografia puede tener maximo 250 caracteres`, 400)
    ),

  email: Joi.string()
    .email()
    .error(errorGenerator(`Debes ingresar un email valido`, 400)),
  avatar: Joi.any(),
});

const editPasswordSchema = Joi.object().keys({
  currentPassword: Joi.string()
    .min(8)
    .required()
    .error(
      errorGenerator(
        `Recuerda que tu password actual debe tener minimo 8 caracteres`,
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .invalid(Joi.ref("currentPassword"))
    .min(8)
    .required()
    .error(
      errorGenerator(
        `Debes ingresar un password nuevo de minimo 8 caracteres`,
        400
      )
    ),
});

const recoverPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(errorGenerator(`Debes ingresar un email valido`, 400)),
});

const resetPasswordSchema = Joi.object().keys({
  recoverCode: Joi.string()
    .length(40)
    .required()
    .error(
      errorGenerator(
        `EL codigo de recuperacion es obligatorio y debe ser de 40 caracteres`,
        400
      )
    ),
  newPassword: Joi.string()
    .min(8)
    .invalid(Joi.ref("currentPassword"))
    .min(8)
    .required()
    .error(
      errorGenerator(
        `Debes ingresar un password nuevo de minimo 8 caracteres`,
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginUserSchema,
  editUserSchema,
  editPasswordSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
};
