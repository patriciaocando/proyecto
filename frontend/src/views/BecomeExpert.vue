<template>
  <div>
    <vue-headful title="Experto | TutorShip" description="Solicitar volverse experto" />
    <div>
      <!--DIV PARA COLOCAR LA IMAGEN DE TUTORSHIPS-->
    </div>
    <div>
      <div>
        <img src="../assets/logoTutorShips.png" />
        <h1>¿Te sientes preparado para ser un experto?</h1>
        <p>Selecciona uno o varios lenguajes en los que quieres ser experto y envíanos tu solicitud.</p>
        <languagesselector :languages="bbddLanguages" v-on:languageId="getComponentLanguage" />
        <p v-show="showError">{{ errorMessage }}</p>

        <button @click="postExpertRequest()">ENNVIAR MI SOLICITUD</button>
        <button @click="cancelRequest()">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import languagesselector from "@/components/LanguageSelector.vue";

import {
  getAuthToken,
  getIdToken,
  alertFunction,
  ENDPOINT,
  config,
} from "../utils/helpers";

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
      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    //TRAER LOS LENGUAGES DE LA BBDD
    async getLanguages() {
      try {
        const response = await axios.get(ENDPOINT + "/languages");
        this.bbddLanguages = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //TRAER EL LENGUAGE ESCOGIDO DEL COMPONENTE/SELECT LENGUAJES
    getComponentLanguage(languageId) {
      this.choosenLanguages = languageId;
    },
    //ENVIAR LA LSOLICTUD AL ADMIN
    async postExpertRequest() {
      //DATOS DEL USUARIO
      let data = {
        languages: this.choosenLanguages,
      };

      //console.log("estoy enviando en la peticion", data.languages);
      try {
        const response = await axios.post(
          ENDPOINT + "/users/upgrade-user",
          data,
          config
        );

        alertFunction(
          "success",
          "Solicitud enviada",
          "EL administrador de Tutorships te responderá proximamente"
        );

        this.$router.push("/");
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }

      /* alertFunction(
        "error",
        "¿Seguro que quieres cancelar?",
        "Puedes volver a solicitar ser experto cuando te sientas emperado"
      ); */
    },

    cancelRequest() {
      location.reload();
    },
  },
  created() {
    this.getLanguages();
  },
};
</script>

<style scoped></style>
