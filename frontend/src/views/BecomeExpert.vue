<template>
  <div class="allContent">
    <vue-headful title="Experto | TutorShip" description="Solicitar volverse experto" />
    <div class="backgroundImage">
      <!--DIV PARA COLOCAR LA IMAGEN DE TUTORSHIPS-->
    </div>

    <div class="registerContent">
      <figure>
        <img
          class="logoTutor"
          src="../assets/logoTutorShips.png"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>

      <div class="registerInputs">
        <h1>¿Te sientes preparado para ser un experto?</h1>
        <p>
          Selecciona uno o varios lenguajes en los que quieres ser experto y
          envíanos tu solicitud.
        </p>
        <languagesselector :languages="bbddLanguages" @languageId="getComponentLanguage" />
        <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>

        <div class="buttonsContent">
          <button @click="postExpertRequest()">ENVIAR MI SOLICITUD</button>
          <button class="cancelButton" @click="cancelRequest()">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { alertFunction } from "../utils/helpers";
import languagesselector from "@/components/LanguageSelector.vue";

export default {
  name: "BecomeExpert",
  components: {
    languagesselector,
  },
  data() {
    return {
      //variables de vista
      errorMessage: "",
      showError: false,
      bbddLanguages: [],

      //variales de componentes
      choosenLanguages: [],
    };
  },
  methods: {
    //TRAER LOS LENGUAJES DE LA BBDD
    async getLanguages() {
      try {
        this.bbddLanguages = await api.getLanguages();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },

    //TRAER EL LENGUAJE ESCOGIDO DEL COMPONENTE/SELECT LENGUAJES
    getComponentLanguage(languageId) {
      this.choosenLanguages = languageId;
      console.log(this.choosenLanguages);
    },
    //ENVIAR LA LSOLICTUD AL ADMIN
    async postExpertRequest() {
      if (this.choosenLanguages.length === 0) {
        this.showError = true;
        this.errorMessage = "Debes seleccionar al menos un lenguaje";
      } else {
        try {
          await api.expertRequest(this.choosenLanguages);

          alertFunction(
            "success",
            "Solicitud enviada",
            "EL administrador de Tutorships te responderá proximamente"
          );

          this.$router.push({ name: "Dashboard" });
        } catch (error) {
          this.showError = true;
          this.errorMessage = error;
        }
      }
    },

    cancelRequest() {
      this.choosenLanguages = "";
      this.$router.push({ name: "Dashboard" });
    },
  },
  created() {
    this.getLanguages();
  },
};
</script>

<style scoped>
* {
  margin: 0;
}
.backgroundImage {
  display: none;
}

figure {
  display: flex;
}

.logoTutor {
  margin: 2rem 0;
}

.allContent {
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
  margin: 2rem;
}

.registerContent h3,
.registerContent input {
  margin-top: 1rem;
}

.registerInputs {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.registerInputs p {
  padding: 1rem 0;
}

.buttonsContent {
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
}

.registerAlert {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 600px) {
  * {
    margin: 0;
  }
  .logoTutor {
    margin: 2rem 0;
  }
  .backgroundImage {
    display: flex;
    height: 100vh;
    background-image: url("../assets/becomeExpert-IMG-tablet.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 64px;
  }

  .allContent {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center; /*centra verticalmente*/
    align-content: center;
    margin: 0 auto;
    height: 100vh;
  }
  .registerContent {
    flex-grow: 1;
    max-width: 40vh;
    margin: 0 auto;
  }
  .registerAlert {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; /*centra verticalmente*/
    margin: 0 auto;
  }
}

@media only screen and (min-width: 1200px) {
  .backgroundImage {
    display: flex;
    height: 100vh;
    width: 55vw;
    background-image: url("../assets/becomeExpert-IMG.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .registerAlert {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center; /*centra verticalmente*/
    align-content: center;
    margin: 0 auto;
  }
}
</style>
