<template>
  <div>
    <vue-headful title="Registro | TutorShip" description="Validación de registro en TutorShip" />
    <div v-show="!showError" class="activateContainer">
      <h1>Has activado tu usuario!</h1>
      <h3>HAZ LOGIN PARA INICIAR SESION</h3>

      <router-link class="button" :to="{ name: 'Login' }">Login</router-link>
    </div>
    <p class="errorMessage" v-show="showError">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from "@/api/api.js";
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
      // console.log(this.$route.params);
      console.log(registrationCode[1]);
      try {
        const response = await api.validateNewUser(registrationCode[1]);
      } catch (error) {
        this.showError = true;
        this.errorMessage =
          "Ha habido un error con tu solicitud, ¡vuelve a intentarlo!";
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
