<template>
  <div>
    <vue-headful title="Password | TutorShip" description="Pagina de ecuperación de contraseña" />
    <img src="../assets/logoTutorShips.png" />

    <div v-show="!showRecoverCode">
      <h1>¿Olvidaste tu contraseña?</h1>
      <p>Te enviaremos un código para researla</p>
      <h3>EMAIL:</h3>
      <input type="email" v-model="email" placeholder="miemail@tutorships.com" required />
      <button @click="sendRecoverCode">ENVIAR</button>
      <button class="cancelButton" @click="cancelRecoverCode()">CANCELAR</button>
    </div>

    <div v-show="showRecoverCode">
      <h1>Resetea tu contraseña</h1>
      <h3>CÓDIGO DE RESETEO DE CONTRASEÑA:</h3>
      <input type="text" v-model="recoverCode" required />
      <h3>EMAIL:</h3>
      <input type="text" v-model="emailConfirm" placeholder="miemail@tutorships.com" required />
      <button @click="sendResetPassword">ENVIAR</button>
      <button class="cancelButton" @click="cancelRecoverCode()">CANCELAR</button>
    </div>
    <p v-show="showError">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { config, ENDPOINT, alertFunction } from "../utils/helpers";

export default {
  name: "RecoverPasword",
  data() {
    return {
      email: "",
      recoverCode: "",
      emailConfirm: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      showRecoverCode: false,
    };
  },
  methods: {
    async sendRecoverCode() {
      if (this.email === "") {
        this.showError = true;
        this.errorMessage =
          "Debes ingresar un email válido para resetear tu contraseña.";
      } else {
        try {
          let data = {
            email: this.email,
          };

          const response = await axios.post(
            ENDPOINT + "/users/recover-password/",
            data
          );
          this.showRecoverCode = true;
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    async sendResetPassword() {
      if (this.emailConfirm === "" || this.recoverCode === "") {
        this.showError = true;
        this.errorMessage =
          "Debes ingresar todos los campos para resetear tu contraseña.";
      } else {
        try {
          let data = {
            recoverCode: this.recoverCode,
            newPassword: this.emailConfirm,
          };
          const response = await axios.post(
            ENDPOINT + "/users/reset-password",
            data
          );

          alertFunction(
            "success",
            "Has reseteado tu contraseña",
            `Has login para entrar de nuevo a TutorShip`
          );
          this.$router.push("/login");
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    cancelRecoverCode() {
      this.recoverCode = "";
      this.emailConfirm = "";
      this.email = "";
      this.showError = false;
      this.showRecoverCode = false;
    },
  },
};
</script>

<style>
</style>