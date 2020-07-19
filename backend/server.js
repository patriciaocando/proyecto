//Variables de entorno
require("dotenv").config();

//modulos node
const express = require("express"); //ayuda con las conexiones con el servidor
const morgan = require("morgan"); //Ver informacion de la peticion del servidor
const bodyparser = require("body-parser"); //leer los json desde el servidor
const fileupload = require("express-fileupload"); //permite cargar archivos desde el servidor

const app = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(fileupload());

//Controllers de ruta
const questionExist = require("./middlewares/questionExist");
const answerExist = require("./middlewares/answerExist");
const isUser = require("./middlewares/isUser");
const isExpert = require("./middlewares/isExpert");
const isAdmin = require("./middlewares/isAdmin");

//Controllers Questions
const getQuestions = require("./controllers/questions/getQuestions");
const getSingleQuestion = require("./controllers/questions/getSingleQuestion");
const postQuestion = require("./controllers/questions/postQuestion");
const editQuestion = require("./controllers/questions/editQuestion");
const deleteQuestion = require("./controllers/questions/deleteQuestion");
const getUserQuestions = require("./controllers/questions/getUserQuestions");
const getQuestionsToAnswer = require("./controllers/questions/getQuestionsToAnswer");

//Controllers Answers
const getAllAnsweredQuestion = require("./controllers/answers/getAllAnsweredQuestion");
const getAnswers = require("./controllers/answers/getAnswers");
const getAnsweredQuestion = require("./controllers/answers/getAnsweredQuestion");
const postAnswer = require("./controllers/answers/postAnswer");
const postAnswerRating = require("./controllers/answers/postAnswerRating");
const editAnswer = require("./controllers/answers/editAnswer");
const deleteAnswer = require("./controllers/answers/deleteAnswer");

//Controllers Languajes-experts
const getExperts = require("./controllers/experts/getExperts");
const userToExpert = require("./controllers/experts/userToExpert");
const addUserLanguage = require("./controllers/experts/addUserLanguage");
const deleteUserLanguage = require("./controllers/experts/deleteUserLanguage");
const upgradeUser = require("./controllers/experts/upgradeUser");
const getExpertLanguages = require("./controllers/experts/getExpertLanguages");
const declineExpert = require("./controllers/experts/declineExpert");

//Controllers Users
const newUser = require("./controllers/users/newUser");
const validateUser = require("./controllers/users/validateUser");
const loginUser = require("./controllers/users/loginUser");
const getUser = require("./controllers/users/getUser");
const editUser = require("./controllers/users/editUser");
const editPassword = require("./controllers/users/editPassword");
const recoverUserPassword = require("./controllers/users/recoverUserPassword");
const resetUserPassword = require("./controllers/users/resetUserPassword");
const deleteUser = require("./controllers/users/deleteUser");

//Controllers Languages
const getLanguages = require("./controllers/languages/getLanguages");
const postNewLanguage = require("./controllers/languages/postNewLanguage");
const editLanguage = require("./controllers/languages/editLanguage");
const deleteLanguage = require("./controllers/languages/deleteLanguage");

//ENDPOINTS - QUESTIONS --------------------------------------//
//Lista todas las preguntas //Filtrar preguntas ✅
//publico //GET
app.get("/questions", getQuestions);

//Mostrar una sola pregunta por id ✅
//publico //get
app.get("/question/:id_question", questionExist, getSingleQuestion);

//Mostrar preguntas con respuestas por id ✅
//privado //GET
app.get(
  "/answered-questions/:id_question",
  isUser,
  questionExist,
  getAnsweredQuestion
);

//Mostrar las preguntas realizadas por un usuario ✅
//privado //GET
app.get("/my-questions/", isUser, getUserQuestions);

//mostrar las preguntas sin responder del lenguage de un experto (usando req.auth.id)  ✅
//privado//get
app.get("/questions/to-answer", isUser, isExpert, getQuestionsToAnswer);

//Publicar pregunta ✅
//privado //post
app.post("/new-question", isUser, postQuestion);

//Editar pregunta ✅
//privado //put
app.put("/edit-question/:id_question", isUser, questionExist, editQuestion);

//Borrar pregunta
//privado //delete ✅
app.delete(
  "/delete-question/:id_question",
  isUser,
  questionExist,
  deleteQuestion
);

//ENDPOINTS - ANSWERS -----------------------------------------//

//Mostrar todas las preguntas con respuestas ✅
//privado //GET
app.get("/answered-questions", isUser, getAllAnsweredQuestion);

//Listar respuestas de un usuario ✅
//Privado //GET
app.get("/answer", isUser, isExpert, getAnswers);

//Publicar respuesta ✅
//privado //post
app.post(
  "/new-answer/:id_question",
  isUser,
  isExpert,
  questionExist,
  postAnswer
);

//Editar respuesta ✅
//privado //put
app.put("/edit-answer/:id_answer", isUser, isExpert, answerExist, editAnswer);

//Borrar respuesta ✅
//privado //delete
app.delete("/delete-answer/:id_answer", isUser, isExpert, deleteAnswer);

//Votar una respuesta ✅
//privado //post
app.post("/rating/answer/:id_answer", isUser, postAnswerRating);

//----------------------------------------------------------//
//ENDPOINTS - USUARIO

//Registro Usuario //publico ✅
//post
app.post("/new-user", newUser);

//Confirmar registro ✅
//GET
app.get("/users/validate/:code", validateUser);

//Login Usuario ✅
//Privado //post
app.post("/users/login", loginUser);

//Ver perfil de usuario ✅
//privado //GET
app.get("/users/profile/:id", isUser, getUser);

//Edicion de perfil ✅
//privado //Post
app.put("/users/edit-profile/:id", isUser, editUser);

//Cambio de contrasenia ✅
//privado //post
app.post("/users/:id/password", isUser, editPassword);

//Recover de password (codigo de validacion) ✅
//publico // get
app.post("/users/recover-password/", recoverUserPassword);

//Cambiar la contrasenia publicamente ✅
//publico //put
app.post("/users/reset-password", resetUserPassword);

//Borrar un usuario ✅
//privado //delete
app.delete("/users/delete-user/:id", isUser, isAdmin, deleteUser);

//ENDPOINTS - EXPERTOS --------------------------------------//

//Lista expertos ✅
//Publico //GET
app.get("/experts", getExperts);

//Listar los lenguages de un experto ✅
//privado //get
app.get("/expert/languages", isUser, isExpert, getExpertLanguages);

//solictar convertirse en experto ✅
//post //privado
app.post("/users/upgrade-user", isUser, upgradeUser);

//Validar nuevo experto ✅
//privado //post
app.post(
  "/users/validate-expert/:id_user/:languages/",
  isUser,
  isAdmin,
  userToExpert
);

//asociar a lenguaje ✅
//privado para expertos
app.put("/users/add-language", isUser, isExpert, addUserLanguage);

//borrar lenguaje de experto ✅
//privado para expertos
app.delete("/users/delete-language", isUser, isExpert, deleteUserLanguage);

//Darse de baja como experto a estudiante ✅
//privado //put
app.put("/users/decline-expert", isUser, declineExpert);

//ENDPOINTS -LENGUAGES  --------------------------------------//

//Listar lenguajes ✅
//publico //GET
app.get("/languages", getLanguages);

/*
 *El CRUD de la entidad lenguages queda para una segunda fase ya que
 *la bbdd se planteo en un primer momento para que los lenguages estuviesen predefinidos el en sistema
 */
//crear nuevo lenguage
//solo administrador //post
app.post("/languages/new-language", isUser, isAdmin, postNewLanguage);

//Editar lenguaje
//solo administrador //put
app.put("/languages/edit-language/:id_language", isUser, isAdmin, editLanguage);

//Borrar lenguaje
//solo administrador //delete
app.delete(
  "/languages/delete-language/:id_language",
  isUser,
  isAdmin,
  deleteLanguage
);

//-----------------------------------//
//MIDDLEWARE ERRORES

//error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

//Middleware
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});
