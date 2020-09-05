<template>
  <div class="container">
    <vue-headful
      title="Preguntas | TutorShip"
      description="Página de las rpreguntas que ha realizado un usuario"
    />
    <span id="sectionTitle">
      <h1>Tus preguntas</h1>
      <h2>Aquí puedes ver las preguntas que has realizado</h2>
    </span>

    <getquestions
      id="questionsBody"
      :questions="questions"
      :answers="answers"
      :route="route"
      @showAnswers="getAnswersById"
      @editquestion="questionEdited"
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
import api from "@/api/api.js";

import getquestions from "@/components/GetQuestions.vue";
import { alertFunction } from "../utils/helpers";

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
        const response = await api.getSingleAnswer(idQuestion);
        this.answers = response;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    async questionEdited() {
      //ALERT DE EDITAR
      alertFunction(
        "success",
        "Actualizado",
        `Has editado tu pregunta exitosamente`
      );
      this.endEdition = true;
      await this.getQuestionsAnwer();
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
