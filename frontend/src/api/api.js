import axios from "axios";
import jwt from "jwt-decode";

export const ENDPOINT = "http://localhost:3000";

//instancia
const authInstance = axios.create({
  baseURL: ENDPOINT,
  /* headers: {
    Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
  }, */
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
  getUserProfile: async function(id) {
    try {
      const dataUser = await axios
        .get(ENDPOINT + "/users/profile/" + id, {
          headers: {
            Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
          },
        })
        .catch((error) => {
          throw error.response.data.message;
        });
      return dataUser.data.data;
    } catch (error) {
      throw error;
    }
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
    const response = await axios
      .put(ENDPOINT + "/users/edit-profile/" + id, formData, {
        headers: {
          Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
        },
      })
      .catch((error) => {
        throw error.response.data.message;
      });
    return response;
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
    try {
      const response = await authInstance.get("/languages");
      return response.data.data;
    } catch (error) {
      return error.response.data.message;
    }
  },
  //ENVIAR SOLICTUD DE EXPERTO AL ADMIN
  expertRequest: async function(languages) {
    try {
      const response = await authInstance
        .post("/users/upgrade-user", {
          languages,
        })
        .catch((error) => {
          throw error.response.data.message;
        });
      return response.data.data;
    } catch (error) {
      return error.response.data.message;
    }
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

  //

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
    const response = await axios
      .get(ENDPOINT + "/my-questions", {
        headers: {
          Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
        },
      })
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },

  ///////////////*  RESPUESTAS  *//////////////////////
  //RATE ANSWER
  postRating: async function(data) {
    try {
      const response = await authInstance
        .post("/rating/answer/" + data.id, {
          rating: data.rating,
        })
        .catch((error) => {
          throw error.response.data.message;
        });
      return response;
    } catch (error) {
      return error.response.data.message;
    }
  },
  getAnswers: async function(idQuestion) {
    const response = await axios
      .get(ENDPOINT + "/answer/" + idQuestion, {
        headers: {
          Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
        },
      })
      .catch((error) => {
        throw error.response.data.message;
      });
    return response.data.data;
  },
};
