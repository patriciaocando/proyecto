require("dotenv").config();
const { dateTransform } = require("./helpers");

function searchFilter(queryParams) {
  let sqlQuery = `
    SELECT 
        Q.id,
        Q.title, 
        Q.question_text, 
        Q.date,         
        U.name_user AS 'Autor',
        U.avatar, 
        Q.id_language,
        LT.name_language,
        Q.status_question
    FROM questions Q
    INNER JOIN users U ON Q.id_user=U.id 
    INNER JOIN languages_tech LT ON Q.id_language=LT.id`;
  const sqlParams = [];

  if (name || search || language || date || status) {
    const conditions = [];

    if (name) {
      conditions.push(`U.name_user LIKE ?`);
      sqlParams.push(`'%${name}%'`);
    }

    if (search) {
      conditions.push(`Q.title LIKE ? OR Q.question_text LIKE ?`);
      sqlParams.push(`'%${search}%'`);
    }

    if (language) {
      conditions.push(`LT.name_language=?`);
      sqlParams.push(`"${language}"`);
    }

    if (date) {
      conditions.push(`Q.date=?`);
      sqlParams.push(`"${dateTransform(date)}"`);
    }

    if (status) {
      conditions.push(`Q.status_question=?`);
      sqlParams.push(`${status}`);
    }

    sqlQuery = `${sqlQuery} WHERE ${conditions.join(" AND ")}`;
  }

  return `${sqlQuery}
  [${sqlParams.join(",")}]`;
}

module.exports = searchFilter;
