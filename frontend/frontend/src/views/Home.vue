<template>
  <div class="home">
    <h1>Bienvenidos a TutorShips</h1>
    <searchcomponent
      @queryParams="collectParams"
      :languages="languages"
      :newSearchData="newSearchData"
      @newSearch="newSearch"
    />
    <p v-show="searchMessage">Resultado de tu búsqueda</p>
    <showquestions
      v-show="isResult"
      id="questionsBody"
      :questions="questions"
      :answers="answers"
      @showAnswers="getAnswersById"
      @rateAnswer="rateAnswer"
    />
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";

import api from "@/api/api.js";
import showquestions from "@/components/GetQuestions.vue";
import searchcomponent from "@/components/SearchComponent.vue";
import { alertFunction } from "../utils/helpers";

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
      isResult: true,

      newSearchData: {},
      searchMessage: false,

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
    newSearch() {
      this.isResult = true;
      this.searchMessage = false;
      this.getQuestions();
    },
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
    collectParams(componentParams) {
      this.queryParams = componentParams;
      this.getQuestions(componentParams);
    },
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
    async getQuestions(componentParams) {
      let response = await api.getQuestions(componentParams);
      if (response === "No hay resultados que coincidan con tu búsqueda") {
        this.newSearchData = {
          response,
          newSearchView: true,
        };
        this.isResult = false;
      } else {
        this.searchMessage = false;
        this.questions = response;
        await this.getLanguages();
      }
    },
    //TRAER LAS RESPUESTA DE LA PREGUNTA SELECCIONADA SI ES USUARIO LOGUEADO
    async getAnswersById(idQuestion) {
      try {
        this.answers = await api.getAnswers(idQuestion);
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    //TRAER LOS LENGUAJES DE LA BBDD PARA EL SELECTOR DE LA BUSQUEDA AVANZADA
    async getLanguages() {
      try {
        this.languages = await api.getLanguages();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
  },
  created() {
    this.getQuestions();
  },
};
</script>

<style scoped>
.home {
  max-width: 90vw;
  margin: 0 auto;
}
#questionsBody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
}
h1 {
  margin-bottom: 2rem;
}

@media only screen and (min-width: 600px) {
  #questionsBody {
    justify-content: space-between;
    align-items: stretch;
    align-content: space-around;
  }
}
@media only screen and (min-width: 1200px) {
  .home {
    max-width: 70vw;
    margin: 0 auto;
  }
}
</style>
