import axios from "axios";
import jwt from "jwt-decode";

export const ENDPOINT = "http://localhost:3000";

//instancia
const authInstance = axios.create({
  baseURL: ENDPOINT,
  headers: {
    Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
  },
});

export default {
  ///////////////*  USUARIOS  *//////////////////////
  login: function(email, password) {
    return axios
      .post(ENDPOINT + "/users/login", {
        email,
        password,
      })
      .then((response) => {
        this.setAuthToken(response.data.data);
        return response.data.data;
      })
      .catch((error) => {
        throw error.response.data.message;
      });
  },
  setAuthToken: function(token) {
    authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  getAuthToken: () => {
    return localStorage.getItem("AUTH_TOKEN_KET");
  },
  logout: () => {
    delete authInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("AUTH_TOKEN_KET");
  },
  getUserTokenId: (encodedToken) => {
    let token = jwt(encodedToken);

    if (!token.id && !token.role) {
      return null;
    } else {
      return {
        id: token.id,
        role: token.role,
      };
    }
  },
  //TRAER LA INFO DEL USUARIO
  getUserProfile: async function(id) {
    const dataUser = await authInstance
      .get("/users/profile/" + id)
      .catch((error) => {
        throw error.response.data.message;
      });
    return dataUser.data.data;
  },
  //REGISTRAR USUARIO
  newUser: async function(data) {
    const response = await axios
      .post(ENDPOINT + "/new-user", data)
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data;
  },
  //ACTUALIZAR PERFIL DE USUARIO
  updateUserProfile: async function(id, formData) {
    const response = await authInstance
      .put("/users/edit-profile/" + id, formData)
      .catch((error) => {
        throw error.response.data.message;
      });
  },
  //ACTUALIZAR CONTRASEÑA DE USUARIO
  updateUserpass: async function(id, data) {
    await authInstance.post(`/users/${id}/password`, data).catch((error) => {
      throw error.response.data.message;
    });
  },
  ///////////////*  EXPERTOS  *//////////////////////
  getAllExperts: async function() {
    const response = await authInstance.get("/experts").catch((error) => {
      throw error.response.data.message;
    });
    return response.data.data;
  },

  ///////////////*  LENGUAJES  *//////////////////////

  //TRAER LOS LENGUAJES DE LA BBDD PARA EL SELECTOR DE LA BUSQUEDA AVANZADA
  getLanguages: async function() {
    const response = await authInstance.get("/languages").catch((error) => {
      throw error.response.data.message;
    });
    return response.data.data;
  },
  //ENVIAR SOLICTUD DE EXPERTO AL ADMIN
  expertRequest: async function(languages) {
    const response = await authInstance
      .post("/users/upgrade-user", {
        languages,
      })
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
  //ASOCIAR UN NUEVO LENGUAJE
  newLanguageExpert: async function(languageId) {
    const response = await authInstance
      .put("/users/add-language", { newlanguage: languageId })
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },

  ///////////////*  PREGUNTAS  *//////////////////////
  //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
  getQuestions: async function(queryParams) {
    const response = await authInstance
      .get("/questions", {
        params: queryParams,
      })
      .catch((error) => {
        throw error.response.data.message;
      });

    return response.data.data;
  },
  //PREGUNTAS DE USUARIO
  userQuestions: async function() {
    const response = await authInstance.get("/my-questions").catch((error) => {
      throw error.response.data.message;
    });
    return response.data.data;
  },
  //NUEVA PREGUNTA
  newQuestion: async function(data) {
    const response = await authInstance
      .post("/new-question", data)
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
  //EDITAR PREGUNTA
  editQuestion: async function(idQuestion, data) {
    await authInstance
      .put("/edit-question/" + idQuestion, data)
      .catch((error) => {
        throw error.response.data.message;
      });
  },
  //BORRAR PREGUNTA
  deleteQuestion: async function(idQuestion) {
    const response = await authInstance
      .delete("/delete-question/" + idQuestion)
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
  //PREGUNTAS PARA EXPERTO
  questionsToAnswer: async function() {
    const response = await authInstance
      .get("/questions/to-answer")
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
  ///////////////*  RESPUESTAS  *//////////////////////
  //RATE ANSWER
  postRating: async function(data) {
    console.log(data);
    const response = await authInstance
      .post("/rating/answer/" + data.id, {
        rating: data.rating,
      })
      .catch((error) => {
        console.log(error);
        throw error.response.data.message;
      });
    return response;
  },

  getAnswers: async function(idQuestion) {
    const response = await authInstance
      .get("/answer/" + idQuestion)
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
};