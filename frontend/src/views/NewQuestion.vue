<template>
  <div>
    <div>
      <h3>TITULO:</h3>
      <input type="text" placeholder="Este es el título de tu pregunta.." v-model="title" />

      <h3>LENGUAJE:</h3>
      <select id="language" v-model="languageQuestion">
        <option>Selecciona un lenguage:</option>
        <option
          v-for="language in languages"
          :key="language.id"
          :value="language.name_language"
        >{{language.name_language}}</option>
      </select>

      <p>{{ languageQuestion }}</p>
      <h3>Escribe tu pregunta:</h3>
      <textarea name="textQuestion" rows="4" placeholder="Haz tu pregunta..." v-model="content"></textarea>
      <p v-show="showError">{{ errorMessage }}</p>

      <button @click="postQuestion()">Publicar</button>
      <button class="cancelButton" @click="cancelQuestion()">Cancelar</button>
      <!-- //FALTA FUNCION DE CANCELAR -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getAuthToken, getIdToken, alertFunction } from "../utils/helpers";

export default {
  name: "NewQuestion",
  data() {
    return {
      //variables de vista
      title: "",
      content: "",
      languageQuestion: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      //variales de componentes
      languages: [],
      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    //TRAER LOS LENGUAGES DE LA BBDD
    async getLanguages() {
      try {
        const response = await axios.get("http://localhost:3000/languages");
        this.languages = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },

    //PUBLICAR LA RESPUESTA
    async postQuestion() {
      //RECOJO LOS DATOS PARA ENVIAR EN EL BODY
      let data = {
        title: this.title,
        content: this.content,
        language: this.languageQuestion,
      };

      //CONFIGURO EL OBJETO DE CONFIGURACION
      let config = {
        headers: {
          Authorization: getAuthToken(),
        },
      };
      //COMPRUEBO QUE LOS DATOS NO ESTEN VACIOS
      if (data.title === "" || data.content === "" || data.language === "") {
        alertFunction(
          "warning",
          "Campos Vacíos",
          "Debes llenar todos los campos para publicar tu pregunta"
        );
      } else {
        try {
          const response = await axios.post(
            "http://localhost:3000/new-question",
            data,
            config
          );
          //ALERT DE CREACION DE PREGUNTA
          alertFunction(
            "success",
            "Pregunta publicada",
            "Se ha publicado tu pregunta exitosamente."
          );
          this.$router.push("/mis-preguntas");
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    cancelQuestion() {
      this.title = "";
      this.content = "";
      this.languageQuestion = "";
    },
  },
  created() {
    this.getLanguages();
  },
};
</script>

<style scoped>
</style>