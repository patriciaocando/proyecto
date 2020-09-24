<template>
  <div class="home">
    <vue-headful title="Tutorship" description="Página principal de TutorShip" />
    <div class="bannerContainer">
      <span>
        <img id="logoMenu" src="../assets/logoTutorshipLigth.svg" alt="logo-tutorships" />

        <h1 class="ligth">¡Lanzate al agua!</h1>
        <h2 class="ligth">Pregunta a nuestros tutores expertos en cada lenguaje de programación</h2>
      </span>
      <div class="bannerImage"></div>
    </div>
    <div class="homeContent">
      <h1>Busca todo lo que necesites:</h1>
      <searchcomponent
        :languages="languages"
        :newSearchData="newSearchData"
        @queryParams="collectParams"
        @newSearch="newSearch"
      />
      <p v-show="searchMessage">Resultado de tu búsqueda</p>

      <getquestions
        v-show="isResult"
        id="questionsBody"
        :questions="questions"
        :route="route"
        @newVote="newVote"
      />
    </div>

    <div id="expert" class="bannerContainer">
      <span>
        <img class="expertIco" src="../assets/icons/experto-blue.svg" />

        <h1>¿Eres un experto?</h1>
        <h2>
          Ayuda a estudiantes de programación a convertirse en masters como
          <b>TÚ.</b>
        </h2>
        <router-link id="registerButton" :to="{ name: 'Register' }">¡Regístrate!</router-link>
      </span>
      <div class="bannerImage"></div>
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api.js";
import getquestions from "@/components/GetQuestions.vue";
import searchcomponent from "@/components/SearchComponent.vue";
import { alertFunction } from "../utils/helpers";

export default {
  name: "Home",
  components: {
    getquestions,
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
    newSearch() {
      this.isResult = true;
      this.searchMessage = false;
      this.getQuestions();
    },
    newVote(data) {
      alertFunction(
        "success",
        "Ranking",
        `¡Has Votado con ${data.rating} puntos!`
      );
      /* this.getAnswersById(data.id);
      console.log("me ejecuto"); */
    },
    collectParams(componentParams) {
      this.queryParams = componentParams;
      this.getQuestions(componentParams);
    },
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
    async getQuestions(componentParams) {
      try {
        let response = await api.getQuestions(componentParams);
        this.searchMessage = false;
        this.questions = response;
        await this.getLanguages();
      } catch (error) {
        if (error === "No hay resultados que coincidan con tu búsqueda") {
          this.newSearchData = {
            error,
            newSearchView: true,
          };
          this.isResult = false;
        }
        //console.error(error);
      }
    },

    //TRAER LOS LENGUAJES DE LA BBDD PARA EL SELECTOR DE LA BUSQUEDA AVANZADA
    async getLanguages() {
      try {
        this.languages = await api.getLanguages();
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getQuestions();
  },
};
</script>

<style scoped>
.homeContent {
  margin: 0 2rem;
}
#logoMenu {
  display: none;
}
.bannerContainer {
  background-image: url("../assets/landing/background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 60vh;
  margin: 0 0 5rem;
}
.bannerContainer h1 {
  display: block;
  font-size: 3em;
  padding-top: 5rem;
}

.bannerContainer h2 {
  display: block;
  font-weight: var(--regular);
  line-height: 2.5rem;
  font-size: 1.8em;
  max-width: 70vw;
  margin: 0 auto;
}
.bannerImage {
  background-image: url("../assets/landing/bienvenido.png");
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 60vh;
  width: 100vw;
  margin: 0;
}

#expert {
  background-image: none;
  background-color: white;
  min-height: 60vh;
  /* width: 100vw; */
  margin: 0;
  margin-top: 2rem;
}

#expert .bannerImage {
  background-image: url("../assets/landing/experto.png");
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 60vh;
  margin: 0;
}

#expert h1 {
  padding-top: 2rem;
}

#expert h2 > b {
  font-weight: var(--bold);
  font-size: 1em;
}

#expert h2 {
  margin-bottom: 2rem;
}
.container h1 {
  text-align: center;
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
  .homeContent {
    margin: 0 6rem;
  }
  #questionsBody {
    justify-content: space-between;
    align-items: stretch;
    align-content: space-around;
  }
}

@media only screen and (min-width: 800px) {
  .bannerContainer img#logoMenu {
    display: block;
    /*   text-align: left;
    background-color: tomato; */
  }
  .bannerContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    align-content: flex-start;
    height: 60vh;
  }
  .bannerContainer span {
    width: 30vw;
  }

  .bannerImage {
    background-position: right bottom;
    height: 60vh;
    width: 50vw;
  }

  .bannerContainer h1 {
    text-align: left;
    font-size: 2em;
    padding-top: 2rem;
  }

  .bannerContainer h2 {
    text-align: left;
    line-height: 2rem;
    font-size: 1.5rem;
    max-width: 30vw;
    margin-left: 0;
  }

  #expert .bannerContainer {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    align-content: flex-start;
    /* height: 60vh; */
  }

  #expert .bannerContainer span {
    width: 30vw;
    text-align: left;
  }

  #expert .expertIco {
    display: block;
  }
  #expert #registerButton {
    display: block;
    left: 0;
    width: 120px;
  }

  .homeContent {
    margin: 0 6rem;
  }
}

@media only screen and (min-width: 1200px) {
  .bannerContainer {
    height: 85vh;
  }
  .bannerContainer span {
    width: 40vw;
  }

  .bannerImage {
    background-position: left bottom;
    height: 85vh;
  }

  .bannerContainer h1 {
    text-align: left;
    font-size: 4em;

    padding-top: 3rem;
  }

  .bannerContainer h2 {
    text-align: left;
    line-height: 2.5rem;
    font-size: 2rem;
    margin-left: 0;
    padding-top: 2rem;
  }
}
</style>
