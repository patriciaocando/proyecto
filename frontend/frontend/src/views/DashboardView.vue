<template>
  <!--ELEMENTOS COMUNES-->
  <div class="container">
    <!--COMPONENTE DE BUSQUEDA-->
    <div id="searchContainer" v-show="searchBar">
      <h3>BIENVENIDO</h3>
      <h1>Encuentra todas las respuestas que necesitas</h1>
      <searchcomponent
        @queryParams="collectParams"
        :languages="languages"
        :newSearchData="newSearchData"
        @newSearch="newSearch"
      />
    </div>
    <!--GESTION DE ERRORES-->
    <p v-show="showError">{{ errorMessage }}</p>
    <!--MOSTRAR LOS RESULTADOS DE LA BUSQUEDA-->

    <!-- <div class="emptyState" v-show="noQuestions">
      <p>Aww... aun no has preguntado nada aún</p>
      <h2>¡Haz tu primera pregunta!</h2>
      <router-link class="button" :to="{ name: 'NewQuestion' }"
        >Hacer pregunta</router-link
      >
    </div> -->

    <div v-show="showResultSearch">
      <h3>RESULTADOS DE TU BÚSQUEDA:</h3>
      <getquestions :questions="questionsResultSearch" />
    </div>

    <div v-show="!showResultSearch" class="mainView">
      <h3 v-show="allQuestions">{{ mesage }}</h3>

      <!--VISTA EXPERTO-->
      <showquestionstoexpert
        v-if="role === 'experto'"
        v-show="allQuestions"
        :questions="questionsToExpert"
        @getQuestion="getQuestion"
      />
      <answerquestion
        v-show="!allQuestions"
        :question="question"
        @publishAnswer="publishAnswer"
        @cancelEdition="cancelEditAnswer"
      />
      <!-- v-on:cancelEdition="cancelEdition" -->
      <!--VISTA ADMIN-->

      <!--VISTA ESTUDIANTE-->
      <div>
        <div>
          <getquestions
            v-if="role === 'estudiante'"
            :questions="studentQuestions"
            :answer="studentAnswers"
            :count="count"
            v-show="showQuestion"
          />
          <div class="emptyState" v-show="noQuestions">
            <h2>¡Haz tu primera pregunta!</h2>
            <router-link class="button" :to="{ name: 'NewQuestion' }"
              >Hacer pregunta</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//COMPONENTES DE BUSQUEDA
import searchcomponent from "@/components/SearchComponent.vue";
import getquestions from "@/components/GetQuestions.vue";
//COMPONENTES PARA EXPERTO
import answerquestion from "@/components/AnswerQuestion.vue";
import showquestionstoexpert from "@/components/GetQuestionsToExpert.vue";

//IMPORTAR UTILIDADES
import axios from "axios";
import {
  getAuthToken,
  getRoleToken,
  getIdToken,
  alertFunction,
  config,
  ENDPOINT,
} from "../utils/helpers";

//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api.js";

export default {
  name: "DashboardView",
  components: {
    getquestions,
    searchcomponent,
    showquestionstoexpert,
    answerquestion,
  },
  data() {
    return {
      //store del usuario
      sharedStore: userData.state,
      //mensaje de actividad reciente
      mesage: "",

      //ocultar barra de busqueda
      searchBar: true,

      newSearchData: {},
      searchMessage: false,

      //Variable para interpolar los lenguajes en la busqueda
      languages: [],

      //Variable estudiante
      studentQuestions: [],
      studentAnswers: [],
      showQuestion: true,
      noQuestions: false,
      count: "",

      //CONTENIDO PARA EDITAR PREGUNTA
      newTitle: "",
      newContent: "",
      question: [],
      questionsToExpert: [],
      allQuestions: true,

      //Variables resultado de la busqueda
      showResultSearch: false,
      questionsResultSearch: [],

      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      /* //TOKEN
      token: "", */
    };
  },
  computed: {
    role() {
      return this.sharedStore.role;
    },
    token() {
      return this.sharedStore.token;
    },
  },

  methods: {
    cancelEditAnswer() {
      this.allQuestions = true;
      this.searchBar = true;
    },
    newSearch() {
      this.isResult = true;
      this.searchMessage = false;
      this.getQuestions();
    },
    //////////////////////////////////////////////////////
    //ENPOINTS GENERALES
    //OBTENGO EL ROL PARA SABER QUE LE VA A MOSTRAR AL USUARIO SEGUN SU ROL
    getRole() {
      if (this.role === "estudiante") {
        this.mesage = "ACTIVIDAD RECIENTE";
        this.getStudentQuestions();
      } else if (this.role === "experto") {
        this.mesage = "PREGUNTAS PARA RESPONDER";
        this.getQuestionsToAnswer();
      } else {
        console.log("carga funcion de admin");
      }
    },

    //RECIBO LOS PARAMETROS DE BUSQUEDA DESDE MI COMPONENTE
    async collectParams(componentParams) {
      this.showQuestion = false;
      this.queryParams = componentParams;

      this.getQuestions(componentParams);
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
    //////////////////////////////////////////////////////
    //ENPOINTS PARA ESTUDIANTE
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD PARA HACER LA CONSULTA DE LA BUSQUEDA
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
    async getQuestions(componentParams) {
      try {
        let response = await api.getQuestions(componentParams);

        this.searchMessage = false;
        this.showResultSearch = true;
        this.questionsResultSearch = response;

        await this.getLanguages();
      } catch (error) {
        this.newSearchData = {
          response: "No hay resultados que coincidan con tu búsqueda",
          newSearchView: true,
        };
        this.isResult = false;
      }
    },

    //DESDE LA BBDD
    async getStudentQuestions() {
      try {
        const response = await api.answersToRespond();
        this.questions = response;

        if (this.questions.length === 0) {
          this.noQuestions = true;
        }
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },

    //////////////////////////////////////////////////////
    //ENPOINTS PARA EXPERTO
    //TRAIGO LAS PREGUNTAS QUE PUEDE RESPONDER EL EXPERTO
    async getQuestionsToAnswer() {
      try {
        const response = await axios.get(ENDPOINT + "/questions/to-answer", {
          headers: {
            Authorization: this.token,
          },
        });
        this.questionsToExpert = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async getQuestion(id) {
      this.searchBar = false;
      try {
        const response = await axios.get(ENDPOINT + "/question/" + id, {
          headers: {
            Authorization: this.token,
          },
        });
        this.question.push(response.data.data);
        this.allQuestions = false;
        this.idQuestion = id;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async publishAnswer(data) {
      try {
        const response = await axios.post(
          ENDPOINT + "/new-answer/" + this.idQuestion,
          data,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        alertFunction(
          "success",
          "HAS RESPONDIDO",
          "Tu respuesta se ha publicado correctamente"
        );
        this.$router.push({ name: "UserQuestions" });
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.getRole();
    this.getLanguages();
  },
};
</script>

<style scoped>
.mainView h3 {
  margin-top: 2rem;
}

.dashHomeContent {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
}
#searchContainer {
  background-color: var(--ligthBlue);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

h3,
#searchContainer h1 {
  text-align: left;
}

@media only screen and (min-width: 600px) {
}
@media only screen and (min-width: 1200px) {
  #searchContainer {
    margin-bottom: 2rem;
  }
  .dashHomeContent {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    align-content: flex-start;
  }

  #searchContainer {
    padding: 2rem;
  }

  h3,
  #searchContainer h1 {
    text-align: left;
    margin: 0.5rem 0;
  }
}
</style>
