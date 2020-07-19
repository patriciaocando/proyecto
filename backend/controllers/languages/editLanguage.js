const { getConnection } = require("../../db.js");
const { errorGenerator, processImage } = require("../../helpers.js");
const { editLanguageSchema } = require("../../validator/languagesValidator.js");
const { send } = require("@sendgrid/mail");

async function editLanguage(req, res, next) {
  let connection;
  try {
    await editLanguageSchema.validateAsync(req.body);

    connection = await getConnection();
    const { id_language } = req.params;
    const { name, description } = req.body;

    const [currentLanguage] = await connection.query(
      `
      SELECT id,
      name_language,
      description,
      image
      FROM languages_tech
      WHERE id=?`,
      [id_language]
    );

    if (currentLanguage.length === 0) {
      throw errorGenerator(
        `El lenguage que quieres editar no existe en la base de datos`,
        400
      );
    }

    let languageImage;
    let imageStatus;
    // Si hay imagen la guardamos y procesamos la imagen
    if (req.files && req.files.image) {
      try {
        //procesar y guardar la imagen
        languageImage = await processImage(req.files.image);
        imageStatus = true;
      } catch (error) {
        throw errorGenerator(`Ha habido un error al procesar la imagen`, 400);
      }
    } else {
      imageStatus = false;
    }

    let sqlQuery = "UPDATE languages_tech";
    let params = [];

    if (description || name || imageStatus) {
      const conditions = [];

      if (description) {
        conditions.push(`description=?`);
        params.push(`${description}`);
      }

      if (name) {
        conditions.push("name_language=?");
        params.push(`${name}`);
      }

      if (imageStatus) {
        conditions.push(`image=?`);
        params.push(`${languageImage}`);
      }
      conditions.push(`update_date=UTC_TIMESTAMP`);
      params.push(id_language);

      sqlQuery = `${sqlQuery} SET ${conditions.join(", ")} WHERE id=?`;
    } else {
      sqlQuery = `UPDATE languages_tech
      SET name_language=?,
      description=?,
      image=?,
      update_date=UTC_TIMESTAMP
      WHERE ID=?
      `;
      params = [
        `${currentLanguage[0].name_language}`,
        `${currentLanguage[0].description}`,
        `${currentLanguage[0].image}`,
        id_language,
      ];
    }

    await connection.query(sqlQuery, params);

    console.log(currentLanguage[0].name_language);

    res.send({
      status: "ok",
      message: `Has editado el lenguage ${id_language}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release;
  }
}

module.exports = editLanguage;
