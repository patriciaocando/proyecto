<template>
  <div>
    <h1>Petición de experto</h1>
    <p>
      EL usuario {{ idUserRequest }} solicita hacerse experto en los languages
      {{ languagesRequest }}
    </p>
    <p v-show="showError">{{ errorMessage }}</p>
    <button @click="validateExpert()">SÍ! HACERLO EXPERTO</button>
  </div>
</template>

<script>
import axios from "axios";
import {
  getAuthToken,
  getIdToken,
  alertFunction,
  getRoleToken,
  ENDPOINT,
  config,
} from "../utils/helpers";

export default {
  name: "ExpertValidation",
  data() {
    return {
      //variables de peticoon de usuario
      idUserRequest: "",
      languagesRequest: "",

      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    getRequestData() {
      let [, url] = window.location.href.split("id=");
      let [userId, languages] = url.split("&lang=");
      this.idUserRequest = userId;
      this.languagesRequest = languages;
      //console.log(getRoleToken(this.token));
    },
    async validateExpert() {
      //CABECERA DE AUTORIZACION
      let config = {
        headers: {
          Authorization: this.token,
          role: getRoleToken(this.token),
        },
      };

      console.log(this.languagesRequest);
      try {
        const response = await axios.post(
          ENDPOINT + "/users/validate-expert/" + this.idUserRequest,
          { languages: this.languagesRequest },
          config
        );
        alertFunction(
          "success",
          "Nuevo Experto",
          `Has dado de alta a un nuevo experto en TutorShips`
        );
      } catch (error) {
        this.showError = true;

        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.getRequestData();
  },
};
</script>

<style scoped></style>
