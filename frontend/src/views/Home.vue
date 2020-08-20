<template>
  <div class="home">
    <h1>Bienvenidos a TutorShips</h1>
    <searchcomponent
      v-on:queryParams="collectParams"
      v-on:clearSearch="clearSearch"
      :languages="languages"
    />

    <p v-show="showError">{{ errorMessage }}</p>
    <showquestions
      id="questionsBody"
      :questions="questions"
      :answers="answers"
      v-on:showAnswers="getAnswers"
      v-on:rateAnswer="rateAnswer"
    />
  </div>
</template>

<script>
import axios from "axios";
import showquestions from "@/components/GetQuestions.vue";
import searchcomponent from "@/components/SearchComponent.vue";
import {
  getAuthToken,
  getRoleToken,
  alertFunction,
  config,
  ENDPOINT,
} from "../utils/helpers";

import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "Home",
  components: {
    showquestions,
    searchcomponent,
  },
  data() {
    return {
      questions: [],
      answers: [],
      queryParams: {},
      languages: [],

      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      successSearch: true,
      //TOKEN
      token: getAuthToken(),
    };
  },

  methods: {
    async rateAnswer(data) {
      console.log("recibo->", data);
      let rating = {
        rating: data.rating,
      };

      try {
        const response = await axios.post(
          ENDPOINT + "/rating/answer/" + data.id,
          rating,
          config
        );
        alertFunction(
          "success",
          "Ranking",
          `¡Has Votado con ${data.rating} puntos!`
        );
      } catch (error) {
        this.errorMessage = error.response.data.message;
        await alertFunction("error", "Opss!", `Ya has votado esta respuesta`);
      }
    },
    async collectParams(componentParams) {
      this.successSearch = true;
      this.showError = false;
      this.queryParams = componentParams;

      await this.getQuestions();
    },
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
    async getQuestions() {
      try {
        const response = await axios.get(ENDPOINT + "/questions", {
          params: this.queryParams,
        });
        this.questions = response.data.data;

        await this.getLanguages();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;

        if (
          this.errorMessage === "No hay preguntas que coincidan con tu busqueda"
        ) {
          this.successSearch = false;
        }
      }
    },
    //TRAER LAS RESPUESTAS DE TODAS LAS PREGUNTAS SI ES USUARIO LOGUEADO
    async getAnswers(idQuestion) {
      try {
        const response = await axios.get(
          ENDPOINT + "/answer/" + idQuestion,
          config
        );
        this.answers = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //TRAER LOS LENGUAGES DE LA BBDD PARA EL SELECTOR DE LA BUSQUEDA AVANZADA
    async getLanguages() {
      try {
        const response = await axios.get(ENDPOINT + "/languages");
        this.languages = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    clearSearch() {
      location.reload();
    },
  },
  created() {
    this.getQuestions();
  },
};
</script>

<style scoped>
#questionsBody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}
h1 {
  margin-bottom: 2rem;
}

@media only screen and (min-width: 600px) {
  #questionsBody {
    width: 90vw;
    justify-content: space-between;
    align-items: stretch;
    align-content: space-around;
    margin: 0 auto;
  }
}
/*@media only screen and (min-width: 1200px) {
} */
</style>
