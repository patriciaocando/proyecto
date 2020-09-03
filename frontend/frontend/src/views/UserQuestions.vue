<template>
  <div class="container">
    <span id="sectionTitle">
      <h1>Tus preguntas</h1>
      <h2>Aquí puedes ver las preguntas que has realizado</h2>
    </span>

    <getquestions
      id="questionsBody"
      :questions="questions"
      :answers="answers"
      @showAnswers="getAnswersById"
      @rateAnswer="rateAnswer"
      @editquestion="getQuestionData"
      @questionDeleted="questionDeleted"
      @questionEdited="questionEdited"
    />

    <div class="emptyState" v-show="noQuestions">
      <p>Aww... aun no has preguntado nada aún</p>
      <h2>¡Haz tu primera pregunta!</h2>
      <router-link class="button" :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import axios from "axios";
import api from "@/api/api.js";

import getquestions from "@/components/GetQuestions.vue";

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
    getquestions,
  },
  data() {
    return {
      questions: [],
      answers: [],
      noQuestions: false,

      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      sharedStore: userData.state,
    };
  },

  computed: {
    token() {
      return this.sharedStore.token;
    },
    route() {
      return this.$route.name;
    },
  },
  methods: {
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
    questionEdited() {
      //ALERT DE EDITAR
      alertFunction(
        "success",
        "Actualizado",
        `Has editado tu pregunta exitosamente`
      );
      this.getQuestionsAnwer();
    },
    questionDeleted() {
      alertFunction("success", "Borrada!", "Tu pregunta ha sido borrada.");
      this.getQuestionsAnwer();
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
</style>
