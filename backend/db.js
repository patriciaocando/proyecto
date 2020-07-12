require("dotenv").config();
const mysql = require("mysql2/promise");

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

//Funcion que se conecta a la base de dator y me devuelve un objeto para poder interactuar con la base de datos
let pool;
async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      timezone: "Z",
    });
  }
  //devuelve una conexion a la base de datos
  return await pool.getConnection();
}

module.exports = { getConnection };
