<template>
  <div>
    <h1>Has activado tu usuario!</h1>
    <h3>HAZ LOGIN PARA INICIAR SESION</h3>
    <p v-show="showError">{{ errorMessage }}</p>
    <button>
      <router-link :to="{ name: 'Login' }">Login</router-link>
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { ENDPOINT } from "../utils/helpers";
export default {
  name: "RegisterValidation",
  data() {
    return {
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    async validationUser() {
      let url = window.location.href;
      let registrationCode = url.split("?");

      try {
        const response = await axios.get(
          ENDPOINT + "/users/validate/" + registrationCode[1]
        );
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.validationUser();
  },
};
</script>

<style scoped></style>
