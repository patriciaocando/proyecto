const { getConnection } = require("../../db");
const { dateTransform, errorGenerator } = require("../../helpers");
const {
  filterQuestionsSchema,
} = require("../../validator/questionsValidators");

async function getQuestions(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    await filterQuestionsSchema.validateAsync(req.query);

    const {
      name,
      direction,
      search,
      language,
      date_init,
      date_end,
      status,
    } = req.query;

    //definir el contenido de status
    let statusValue;
    if (status === "true" || status === "1") {
      statusValue = 1;
    } else if (status === "false" || status === "0") {
      statusValue = 0;
    }

    let directionValue;
    if (!direction) {
      directionValue = `DESC`;
    } else {
      directionValue = direction;
    }

    let orderBy = `ORDER BY Q.date ${directionValue}`;

    let sqlQuery = `
    SELECT 
        Q.id, 
        Q.title, 
        Q.question_text, 
        Q.date, 
        Q.status_question,
        U.id AS 'idUser',
        COALESCE(U.name_user, U.username) AS 'name_user', 
        U.avatar, 
        LT.id AS 'idLanguages',
        LT.name_language 
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id`;

    const sqlParams = [];

    if (name || search || language || date_init || date_end || status) {
      const conditions = [];

      if (name) {
        conditions.push(`U.name_user LIKE ?`);
        sqlParams.push(`%${name}%`);
      }

      if (search) {
        conditions.push(`Q.title LIKE ? OR Q.question_text LIKE ?`);
        sqlParams.push(`%${search}%`);
        sqlParams.push(`%${search}%`);
      }

      if (language) {
        conditions.push(`LT.name_language=?`);
        sqlParams.push(`${language}`);
      }

      if (date_init || date_end) {
        conditions.push(`Q.date >= ? AND Q.date <= ?`);
        sqlParams.push(dateTransform(date_init));
        sqlParams.push(dateTransform(date_end));
      }

      if (status) {
        conditions.push(`Q.status_question=?`);
        sqlParams.push(statusValue);
      }

      sqlQuery = `${sqlQuery} WHERE ${conditions.join(" AND ")} `;
    }

    const [queryResult] = await connection.query(
      `${sqlQuery} ${orderBy}`,
      sqlParams
    );

    if (queryResult.length === 0) {
      throw errorGenerator(
        `No hay resultados que coincidan con tu búsqueda`,
        400
      );
    } else {
      //buscar las respuestas en las preguntas
      for (const [i, question] of queryResult.entries()) {
        if (question.status_question === 1) {
          const [answer] = await connection.query(
            `
      SELECT COUNT(id) AS 'count'
      FROM answers
      WHERE id_question=?
      `,
            [question.id]
          );
          queryResult[i].answers = answer[0].count;
        } else {
          queryResult[i].answers = 0;
        }
      }
    }

    res.send({
      status: "ok",
      data: queryResult,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getQuestions;
