<template>
  <!--ELEMENTOS COMUNES-->
  <div class="container">
    <vue-headful title="Dashboard" description="Dashboard experto" />
    <!--COMPONENTE DE BUSQUEDA-->
    <div id="searchContainer" v-if="searchBar">
      <h3>BIENVENIDO!!</h3>
      <h1>Encuentra todas las respuestas que necesitas</h1>
      <searchcomponent
        :newSearchData="newSearchData"
        @queryParams="getQuestions"
        @newSearch="newSearch"
      />
    </div>
    <h3 v-if="searchBar">{{ mesage }}</h3>
    <getquestions
      v-if="searchBar"
      :questions="questions"
      @getQuestionToAnswer="getQuestionToAnswer"
    />

    <div class="emptyState" v-show="emptyState">
      <h2>¡Haz tu primera pregunta!</h2>
      <router-link class="button" :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
    </div>

    <!-- COMPONENTE PARA RESPONDER UNA PREGUNTA -->
    <answerquestion
      v-show="!searchBar"
      v-if="activar"
      :question="questionToAnswer"
      @cancelEdition="cancelEditAnswer"
    />
  </div>
</template>

<script>
//COMPONENTES DE BUSQUEDA
import searchcomponent from "@/components/SearchComponent.vue";
import getquestions from "@/components/GetQuestions.vue";
//COMPONENTES PARA EXPERTO
import answerquestion from "@/components/AnswerQuestion.vue";

//IMPORTAR UTILIDADES
import { alertFunction } from "../utils/helpers";

//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api.js";

export default {
  name: "DashboardView",
  components: {
    getquestions,
    searchcomponent,
    answerquestion,
  },
  data() {
    return {
      //store del usuario
      sharedStore: userData.state,
      //mensaje de actividad reciente
      mesage: "",

      //oculta la barra de busqueda si se va a responder alguna pregunta
      searchBar: true,
      newSearchData: {},
      searchMessage: "",

      questions: [],
      questionToAnswer: {},
      activar: false,

      emptyState: "",
      //mostrar el componente de responder
      isAnswer: false,
    };
  },
  computed: {
    role() {
      return this.sharedStore.role;
    },
    token() {
      return this.sharedStore.token;
    },
    route() {
      return this.$route.name;
    },
  },

  methods: {
    //*BUSQUEDA: DATA PARA EL BOTON DE NUEVA BUSQUEDA
    newSearch() {
      this.searchMessage = false;
      this.showResultSearch = false;
      // this.getRole();
    },
    //*BUSQUEDA: RECIBO LOS PARAMETROS DE BUSQUEDA DESDE MI COMPONENTE
    async getQuestions(componentParams) {
      try {
        this.questions = await api.getQuestions(componentParams);

        this.searchMessage = false;
        this.mesage = "RESULTADOS DE TU BÚSQUEDA";
      } catch (error) {
        if (error === "No hay resultados que coincidan con tu búsqueda") {
          this.newSearchData = {
            error,
            newSearchView: true,
          };
          this.showResultSearch = false;
          this.mesage = "";
        }
        console.error(error);
      }
    },
    async getRole() {
      console.log(this.role);
      if (this.role === "estudiante") {
        this.mesage = "ACTIVIDAD RECIENTE:";
        await this.getStudentQuestions();
      } else if (this.role === "experto") {
        this.mesage = "PREGUNTAS PARA RESPONDER:";
        this.getQuestionsForExpert();
      } else {
        //console.log("carga funcion de admin");
      }
    },
    //*ESTUDIANTE: LAS PREGUNTAS QUE HA HECHO EL ESTUDIANTE RECIENTEMENTE
    async getStudentQuestions() {
      try {
        this.questions = await api.userQuestions();

        if (this.questions.length === 0) {
          this.emptyState = true;
        }
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    //*EXPERTO: TRAIGO LAS PREGUNTAS QUE PUEDE RESPONDER EL EXPERTO
    async getQuestionsForExpert() {
      try {
        this.questions = await api.questionsForExpert();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    //*EXPERTO: ID DE LA PREGUNTA QUE SE QUIERE RESPONDER
    async getQuestionToAnswer(idQuestion) {
      console.log("desde Dash", idQuestion);

      try {
        this.searchBar = false;
        const response = await api.questionToAnswer(idQuestion);
        if (response !== {}) {
          this.activar = true;
          this.questionToAnswer = response;
          console.log(this.questionToAnswer);
        }
      } catch (error) {
        console.error(error);
      }
    },
    cancelEditAnswer() {
      this.searchBar = true;
      this.getRole();
    },
  },
  created() {
    this.getRole();
    //this.getStudentQuestions();
    //this.getQuestionsForExpert();
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
  padding: 2rem;
}

#searchContainer h1 {
  text-align: left;
  margin-bottom: 2rem;
}

@media only screen and (min-width: 600px) {
  #searchContainer {
    background-color: var(--ligthBlue);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
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
