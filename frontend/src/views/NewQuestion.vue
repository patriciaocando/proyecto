<template>
  <div class="container">
    <vue-headful
      title="Nueva pregunta  |  Tutorship"
      description="Publicar una nueva pregunta en la plataforma"
    />
    <span id="sectionTitle">
      <h1>Nueva pregunta</h1>
      <h2>Escoge el lenguaje de programacion y escribe tu pregunta</h2>
    </span>

    <div class="newQuestionContainer">
      <h3>TITULO:</h3>
      <input
        class="titleInput"
        type="text"
        placeholder="Escribe el título de tu pregunta"
        v-model="title"
      />

      <h3>LENGUAJE:</h3>
      <select id="aviableLanguages" v-model="languageQuestion">
        <option>Selecciona un lenguaje:</option>
        <option
          v-for="language in languages"
          :key="language.id"
          :value="language.language"
        >{{ language.language }}</option>
      </select>

      <p
        id="selectedLanguage"
        v-if="languageQuestion !== ''"
        :class="'languageStyle ' + languageQuestion.toLowerCase()"
      >{{ languageQuestion }}</p>
      <h3>Escribe tu pregunta:</h3>

      <textarea
        id="newQuestion"
        name="textQuestion"
        rows="4"
        placeholder="Haz tu pregunta"
        v-model="content"
      ></textarea>
      <p v-show="showError">{{ errorMessage }}</p>
      <span class="buttonsContainer">
        <button @click="postQuestion()">Publicar</button>
        <button class="cancelButton" @click="cancelQuestion()">Cancelar</button>
      </span>
    </div>
  </div>
</template>

<script>
import userData from "@/dataStorage/userData";
import Swal from "sweetalert2";
import api from "../api/api";

import { alertFunction } from "../utils/helpers";

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
      sharedStore: userData.state,
    };
  },
  computed: {
    token() {
      return this.sharedStore.token;
    },
  },
  methods: {
    //TRAER LOS LENGUAJES DE LA BBDD
    async getLanguages() {
      try {
        const response = await api.getLanguages();
        this.languages = response;
      } catch (error) {
        console.log(error);
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

      if (data.title === "" || data.content === "" || data.language === "") {
        alertFunction(
          "warning",
          "Campos Vacíos",
          "Debes llenar todos los campos para publicar tu pregunta"
        );
      } else {
        try {
          const response = await api.newQuestion(data);
          //ALERT DE CREACION DE PREGUNTA
          alertFunction(
            "success",
            "Pregunta publicada",
            "Se ha publicado tu pregunta exitosamente."
          );
          this.$router.push({ name: "UserQuestions" });
        } catch (error) {
          this.showError = true;
          this.errorMessage = error;
        }
      }
    },
    cancelQuestion() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres cancelar esta pregunta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "var(--blue)",
        cancelButtonColor: "var(--red)",
        confirmButtonText: "Si, Cancelar",
      }).then((result) => {
        if (result.value) {
          this.title = "";
          this.content = "";
          this.languageQuestion = "";
          this.$router.push({ name: "Dashboard" });
        } else {
          this.title = this.title;
          this.content = this.content;
          this.language = this.languageQuestion;
        }
      });
    },
  },
  async created() {
    await this.getLanguages();
  },
};
</script>

<style scoped>
.container {
  text-align: left;
}

#selectedLanguage {
  margin-bottom: 1rem;
}
.newQuestionContainer {
  text-align: left;
  background-color: var(--ligthColor);
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}
#aviableLanguages {
  width: 30%;
  margin-bottom: 0.5rem;
}

.buttonsContainer {
  display: flex;
  justify-content: flex-end;
}

@media only screen and (min-width: 1200px) {
  .titleInput {
    width: 95%;
    margin-bottom: 1rem;
  }

  #newQuestion {
    width: 95%;
    height: 13rem;
  }
  .buttonsContainer {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
