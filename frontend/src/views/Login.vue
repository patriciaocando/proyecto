<template>
  <div>
    <vue-headful title="Login | TutorShip" description="Pagina de login" />
    <div>
      <!--DIV PARA COLOCAR LA IMAGEN DE TUTORSHIPS-->
    </div>
    <div>
      <img src="../assets/logoTutorShips.png" />
      <div>
        <h3>EMAIL:</h3>
        <input type="text" v-model="email" placeholder="miemail@tutorships.com" required />
        <h3>PASSWORD:</h3>
        <input type="password" v-model="password" placeholder="Password" required />
        <p v-show="showError">{{ errorMessage }}</p>
        <button @click="loginUser()">Login</button>
        <button class="cancelButton" @click="cancelLogin()">CANCELAR</button>
      </div>
      <router-link :to="{ name: 'RecoverPassword' }">¿Olvidaste tu contraseña?</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { login } from "../utils/helpers";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    cancelLogin() {
      location.reload();
    },
    async loginUser() {
      if (this.email === "" || this.password === "") {
        alert("Debes llenar todos los campos");
      } else {
        try {
          await login(this.email, this.password);

          this.$router.push("/dashboard");
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
  },
};
</script>

<style scoped></style>
