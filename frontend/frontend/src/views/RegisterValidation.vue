<template>
  <div class="activateContainer">
    <h1>Has activado tu usuario!</h1>
    <h3>HAZ LOGIN PARA INICIAR SESION</h3>
    <p class="errorMessage" v-show="showError">{{ errorMessage }}</p>
    <router-link class="button" :to="{ name: 'Login' }">Login</router-link>
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
      console.log(this.$route.params);

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

<style scoped>
.activateContainer {
  height: 70vh;
  margin-top: 2em;
}
.errorMessage {
  margin: 2rem 0;
}

h3 {
  margin-bottom: 2rem;
}
</style>
