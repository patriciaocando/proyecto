require("dotenv").config();
const { getConnection } = require("./db");
const faker = require("faker");
const { random } = require("lodash");
const { randomCodeString } = require("./helpers");

async function main() {
  let connection;
  try {
    //Iniciar bd
    console.log("Conectando con la base de datos");
    connection = await getConnection();

    //borrar las tablas
    console.log("Borrando el contenido de las tablas de la base de datos");
    await connection.query("DROP TABLE IF EXISTS users_languages;");
    await connection.query("DROP TABLE IF EXISTS users_rating;");
    await connection.query("DROP TABLE IF EXISTS answers;");
    await connection.query("DROP TABLE IF EXISTS questions;");
    await connection.query("DROP TABLE IF EXISTS languages_tech;");
    await connection.query("DROP TABLE IF EXISTS users;");

    console.log(`Creando las tablas`);

    await connection.query(`CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_user VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50)  NOT NULL,
    profile_bio TINYTEXT,
    avatar TINYTEXT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(128)NOT NULL,
    role ENUM('estudiante','experto','admin'),
    active BOOLEAN DEFAULT false,
    registration_code TINYTEXT,
    password_code TINYTEXT,
    last_auth_date DATETIME,
    update_date DATETIME,
    creation_date DATETIME
);`);

    await connection.query(`CREATE TABLE languages_tech (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name_language ENUM('Javascript','CSS','HTML','Java','PHP','SQL','Angular','Vue', 'NodeJS'),
    description VARCHAR(200),
    image VARCHAR(200),
    update_date DATETIME,
    creation_date DATETIME
);`);

    await connection.query(`CREATE TABLE questions (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200)  NOT NULL,
    question_text VARCHAR(500) NOT NULL,
    date TIMESTAMP,
    status_question BOOLEAN DEFAULT FALSE,
    id_user INT UNSIGNED  NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    update_date DATETIME,
    creation_date DATETIME
);`);

    await connection.query(`CREATE TABLE answers (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    answer_text VARCHAR(800) NOT NULL,
    date_answer DATETIME NOT NULL,
    id_question INT UNSIGNED NOT NULL,
    FOREIGN KEY (id_question) REFERENCES questions (id),
    id_user_expert INT UNSIGNED,
    FOREIGN KEY (id_user_expert) REFERENCES users (id),
	update_date DATETIME,
    creation_date DATETIME
);`);

    await connection.query(`CREATE TABLE users_rating (
 	id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_answer INT UNSIGNED,
    FOREIGN KEY (id_answer) REFERENCES answers (id),
    PRIMARY KEY (id_user, id_answer),
    rating INT,
    update_date DATETIME,
    creation_date DATETIME
);`);

    await connection.query(`CREATE TABLE users_languages (
	id_user INT UNSIGNED,
    FOREIGN KEY (id_user) REFERENCES users (id),
    id_language INT UNSIGNED,
    FOREIGN KEY (id_language) REFERENCES languages_tech (id),
    PRIMARY KEY (id_user, id_language),
    update_date DATETIME,
    creation_date DATETIME
);`);

    //meter datos de prueba
    //usuario administrador
    console.log("Creando usuario adminsitrador");

    await connection.query(
      `
      INSERT INTO users(name_user, last_name, email, profile_bio, username, password, role, active, last_auth_date, update_date, creation_date)
      VALUES("Patricia", "Ocando","hola@patriciaocando.com",
      "Graphic and UI designer || Full stack developer student",
      "Tutorships",SHA2("${process.env.DEFAULT_ADMIN_PASS}",512),"admin",true, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `
    );

    //usuario generico experto
    console.log("Creando usuario tutorships");
    await connection.query(
      `
      INSERT INTO users(
        name_user,
        email,
        profile_bio,
        username,
        password,
        role,
        active,
        last_auth_date,
        update_date,
        creation_date)
      VALUES("Tutorships","tutorshipsproject@gmail.com","TutorShip User","tutorshipUser",
      SHA2("${process.env.DEFAULT_TUTURSHIP_USER_PASS}",512),"experto",true, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `
    );

    //tabla usuarios
    console.log("Creando datos de muestra - tabla usuarios");

    const users = 10;
    const expertsId = [];

    for (let i = 0; i < users; i++) {
      const name = faker.name.findName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email();
      const profileBio = faker.lorem.sentence();
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const roles = ["estudiante", "experto"];
      const randomRole = roles[random(0, 1)];

      await connection.query(
        `
        INSERT INTO users(name_user, last_name, email, profile_bio, username, password, active, role, last_auth_date, update_date, creation_date)
        VALUES("${name}","${lastName}","${email}","${profileBio}", "${userName}",SHA2("${password}",512), true,
        "${randomRole}",
         UTC_TIMESTAMP, UTC_TIMESTAMP,UTC_TIMESTAMP)
        `
      );
    }

    //Consulta para saber que usuarios son los expertos
    const [expertsIdSql] = await connection.query(`
      SELECT id
      FROM users
      WHERE role="experto";
      `);

    for (let i = 0; i < expertsIdSql.length; i++) {
      if (expertsIdSql[i].id > 2) {
        expertsId.push(expertsIdSql[i].id);
      }
    }
    const countExperts = expertsId.length;

    //tabla Lenguajes
    console.log("Creando datos de muestra - languages_tech");

    const languages = [
      "Javascript",
      "CSS",
      "HTML",
      "Java",
      "PHP",
      "SQL",
      "Angular",
      "Vue",
      "NodeJS",
    ];

    for (let i = 0; i < languages.length; i++) {
      const languageIndexName = languages[i];
      const description = `${languageIndexName} es ${faker.lorem.sentence()}`;

      await connection.query(
        `
            INSERT INTO languages_tech(name_language,description, update_date,creation_date)
            VALUES("${languageIndexName}","${description}",UTC_TIMESTAMP,UTC_TIMESTAMP)
            `
      );
    }

    //Encontrar el ID de el language
    const [idLanguageSql] = await connection.query(`
    SELECT id
    FROM languages_tech;`);
    const idLanguage = [];

    for (let i = 0; i < idLanguageSql.length; i++) {
      idLanguage.push(idLanguageSql[i].id);
    }
    const countLanguajes = idLanguage.length;

    //Encontrar el ID de Users para saber cuantos usuarios se ha creado para asiagnar preguntas
    const [idUserSql] = await connection.query(`
    SELECT id
    FROM users;`);

    const idUser = [];

    for (let i = 0; i < idUserSql.length; i++) {
      if (idUserSql[i].id > 2) {
        idUser.push(idUserSql[i].id);
      }
    }
    const countUsers = idUser.length;

    //tabla users_laguages
    console.log("Creando datos de muestra - Tabla users_laguages");

    for (let i = 0; i < countExperts; i++) {
      const userExpertId = expertsId[i];
      const randomLanguage = idLanguage[i];
      await connection.query(`
      INSERT INTO users_languages(id_user, id_language,update_date, creation_date)
      VALUES("${userExpertId}","${randomLanguage}",UTC_TIMESTAMP,UTC_TIMESTAMP)
      `);
    }

    //asignar al tutorshipUser todos los lenguajes

    for (let i = 0; i < countLanguajes; i++) {
      await connection.query(`
      INSERT INTO users_languages(id_user, id_language,update_date, creation_date)
      VALUES(2,"${idLanguage[i]}",UTC_TIMESTAMP,UTC_TIMESTAMP)
      `);
    }

    //tabla Preguntas
    console.log("Creando datos de muestra - Tabla Preguntas");
    const questions = 15;

    for (let i = 0; i < questions; i++) {
      const title = faker.lorem.sentence();
      const questionText = faker.lorem.paragraph();
      const randomIdStudent = idUser[random(0, countUsers - 1)];
      const randomLanguage = idLanguage[random(0, countLanguajes - 1)];

      await connection.query(`
          INSERT INTO questions(title, question_text, id_user, id_language, update_date, creation_date)
          VALUES("${title}", "${questionText}", ${randomIdStudent},"${randomLanguage}", UTC_TIMESTAMP,UTC_TIMESTAMP)
          `);
    }

    //tabla Respuestas
    console.log("Creando datos de muestra - Tabla Respuestas");
    const answers = 7;

    //Seleccionar el ID de las preguntas
    const [idQuestionSql] = await connection.query(`
    SELECT id, id_language
    FROM questions
    WHERE id>2 ;`);

    const idQuestion = [];
    const idQuestionLanguage = [];

    for (let i = 0; i < idQuestionSql.length; i++) {
      idQuestion.push(idQuestionSql[i].id);
      idQuestionLanguage.push(idQuestionSql[i].id_language);
    }

    const countQuestions = idQuestion.length;
    //let countAnswers = 0;

    for (let i = 0; i < answers; i++) {
      const answerText = faker.lorem.paragraph();
      const randomIndex = random(0, countQuestions - 1);
      const randomIdQuestion = idQuestion[randomIndex];

      const [idExpertSql] = await connection.query(
        `
      SELECT id_user
      FROM users_languages
      WHERE id_language=? AND id_user>2;
      `,
        [idQuestionLanguage[randomIndex]]
      );
      const countExpertAnswer = idExpertSql.length;

      if (countExpertAnswer > 0) {
        const randomUserId =
          idExpertSql[random(0, countExpertAnswer - 1)].id_user;
        const randomVote = random(1, 5);
        const radomUserRating = random(1, countUsers);

        await connection.query(`
        INSERT INTO answers(answer_text, date_answer, id_question, id_user_expert, update_date, creation_date)
        VALUES("${answerText}", UTC_TIMESTAMP, "${randomIdQuestion}","${randomUserId}", UTC_TIMESTAMP,UTC_TIMESTAMP);
          `);

        await connection.query(`
        UPDATE questions
        SET status_question=true
        WHERE id="${randomIdQuestion}";
      `);

        //Trae el ultimo elemento insertado en la tabla answer
        const [answerId] = await connection.query(`
        SELECT id 
        FROM answers
        ORDER BY id DESC
        LIMIT 1;`);

        await connection.query(`
        INSERT INTO users_rating(id_user, id_answer, rating, update_date, creation_date)
        VALUES("${radomUserRating}","${answerId[0]}",
        "${randomVote}", UTC_TIMESTAMP,UTC_TIMESTAMP)
        `);

        //countAnswers++;
      }
    }

    //tabla Rating
    /* console.log("Creando datos de muestra - Tabla Ratings");

    for (let i = 0; i < countAnswers; i++) {
      const radomUserRating = random(1, countUsers);
      const radomQuestion = random(1, countAnswers);
      const randomVote = random(1, 5);

      await connection.query(`
      INSERT INTO users_rating(id_user, id_answer, rating, update_date, creation_date)
      VALUES("${radomUserRating}","${radomQuestion}",
      "${randomVote}", UTC_TIMESTAMP,UTC_TIMESTAMP)
      `);
    } */
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      connection.release();
    }

    console.log("Todo Correcto. Liberando conexión");

    process.exit();
  }
}

main();
