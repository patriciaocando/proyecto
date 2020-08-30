<template>
  <div class="container">
    <span id="sectionTitle" v-show="!hideQuestion">
      <h1>Tus preguntas</h1>
      <h2>Aquí puedes ver las preguntas que has realizado</h2>
    </span>

    <showquestions
      id="questionsBody"
      v-if="!hideQuestion"
      :questions="questions"
      :answers="answers"
      @showAnswers="getAnswersById"
      @rateAnswer="rateAnswer"
      @editquestion="getQuestionData"
    />

    <div class="emptyState" v-show="noQuestions">
      <p>Aww... aun no has preguntado nada aún</p>
      <h2>¡Haz tu primera pregunta!</h2>
      <router-link class="button" :to="{ name: 'NewQuestion' }"
        >Hacer pregunta</router-link
      >
    </div>

    <!--EDITAR PREGUNTA-->
    <div class="questionEdit" v-if="hideQuestion">
      <h2>EDITAR PREGUNTA:</h2>

      <h3>TITULO:</h3>
      <input
        class="titleInput"
        type="text"
        :placeholder="title"
        v-model="title"
      />

      <textarea
        type="text"
        name="textQuestion"
        rows="4"
        :placeholder="content"
        v-model="content"
      ></textarea>

      <div class="buttonsContainer">
        <button class="deleteButton" @click="deleteQuestion()">
          Borrar pregunta
        </button>
        <div class="buttonsInsideContainer">
          <button @click="saveEdition()">GUARDAR</button>
          <button class="cancelButton" @click="cancelEdition()">
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import axios from "axios";
import api from "@/api/api.js";

import question from "@/components/Question.vue";
import showquestions from "@/components/GetQuestions.vue";

import {
  getAuthToken,
  getIdToken,
  alertFunction,
  config,
  ENDPOINT,
} from "../utils/helpers";

export default {
  name: "UserQuestions",
  components: {
    question,
    showquestions,
  },
  data() {
    return {
      questions: [],
      answers: [],
      hideQuestion: false,
      noQuestions: false,

      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //Variables de la pregunta que se debe editar
      title: "",
      content: "",
      idQuestion: "",

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
    //DESDE LA VISTA
    cancelEdition() {
      this.title = "";
      this.content = "";
      this.hideQuestion = false;
      this.showQuestion = true;
    },
    //TRAER LAS PREGUNTAS QUE HA HECHO EL USUARIO DESDE LA BBDD
    async getQuestionsAnwer() {
      try {
        const response = await api.userQuestions();
        this.questions = response;

        if (this.questions.length === 0) {
          this.noQuestions = true;
        }
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    //TRAER LAS RESPUESTA DE LA PREGUNTA SELECCIONADA SI ES USUARIO LOGUEADO
    async getAnswersById(idQuestion) {
      try {
        const response = await api.getAnswers(idQuestion);
        this.answers = response;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    //VOTAR UNA RESPUESTA
    async rateAnswer(data) {
      try {
        const response = await api.postRating(data);

        alertFunction(
          "success",
          "Ranking",
          `¡Has Votado con ${data.rating} puntos!`
        );
      } catch (error) {
        await alertFunction("error", "Opss!", `Ya has votado esta respuesta`);
      }
    },

    //DESDE EL COMPONENTE
    async getQuestionData(id) {
      this.hideQuestion = true;

      try {
        const response = await axios.get(ENDPOINT + "/question/" + id, {
          headers: {
            Authorization: this.token,
          },
        });

        this.title = response.data.data.title;
        this.content = response.data.data.question_text;
        this.idQuestion = id;
      } catch (error) {
        console.error(error);
      }
    },

    async saveEdition() {
      //DATA
      let data = {
        title: this.title,
        content: this.content,
      };

      try {
        const response = await axios.put(
          ENDPOINT + "/edit-question/" + this.idQuestion,
          data,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        //ALERT DE EDITAR
        alertFunction(
          "success",
          "Actualizado",
          `Has editado tu pregunta exitosamente`
        );
        await this.getQuestionsAnwer();
        this.hideQuestion = false;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }

      //ALERT DE EDITAR
      alertFunction(
        "success",
        "Actualizado",
        `Has editado tu pregunta exitosamente`
      );
    },
    async deleteQuestion() {
      try {
        const response = await axios.delete(
          ENDPOINT + "/delete-question/" + this.idQuestion,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        alertFunction("Borrada!", "Tu pregunta ha sido borrada.", "success");
        this.hideQuestion = false;
        await this.getQuestionsAnwer();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.getQuestionsAnwer();
  },
};
</script>

<style scoped>
* {
  text-align: left;
  margin-bottom: 1rem;
}

.questionEdit {
  /*  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%; */
  background-color: var(--ligthColor);
  padding: 2rem 0 2rem 2rem;
  border-radius: 0.5rem;
  -webkit-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  -moz-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
}

textarea {
  height: 20rem;
}
@media only screen and (min-width: 600px) {
  .buttonsInsideContainer {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .buttonsContainer {
    margin: 0;
    flex-direction: row;
    align-items: center;
  }
  .deleteButton {
    background-position: 3% 50%;
    flex-grow: 1;
  }
}
@media only screen and (min-width: 1200px) {
  .buttonsContainer {
    align-items: center;
    justify-content: space-between;
    width: 95%;
  }
  .deleteButton {
    background-position: 1% 50%;
    padding: 2rem;
    flex-grow: 0;
  }
}
</style>
