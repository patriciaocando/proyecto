const { getConnection } = require("../../db");
const { processImage, errorGenerator } = require("../../helpers");

const { newLanguageSchema } = require("../../validator/languagesValidator");

async function postNewLanguage(req, res, next) {
  let connection;
  try {
    await newLanguageSchema.validateAsync(req.body);

    connection = await getConnection();
    const { name, description } = req.body;

    const [currentLanguage] = await connection.query(
      `
    SELECT name_language, image, id
    FROM  languages_tech
    WHERE name_language=?
    `,
      [name]
    );

    if (currentLanguage.length > 0) {
      throw errorGenerator(
        `El lenguage con el nombre ${name} ya existe en base de datos`,
        403
      );
    }

    let languageImage;
    // Si hay imagen la guardamos
    if (req.files && req.files.image) {
      try {
        //procesar y guardar la imagen
        languageImage = await processImage(req.files.image);
      } catch (error) {
        throw errorGenerator(`Ha habido un error al procesar la imagen`, 400);
      }
    }

    await connection.query(
      `
      INSERT INTO languages_tech(
      name_language,
      description,
      image,
      update_date,
      creation_date)
      VALUES("${name}","${description}","${languageImage}",UTC_TIMESTAMP,UTC_TIMESTAMP)
      `
    );

    res.send({
      status: "ok",
      message: `Has creado el lenguage ${name}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postNewLanguage;
