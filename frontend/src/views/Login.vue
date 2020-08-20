<template>
  <div class="allContent">
    <vue-headful title="Login | TutorShip" description="Pagina de login" />
    <div class="backgroundImage"></div>

    <div class="loginContent">
      <figure>
        <img
          class="logoTutor"
          src="../assets/logoTutorShips.png"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>

      <div class="loginInputs">
        <h3>EMAIL:</h3>
        <input type="text" v-model="email" placeholder="miemail@tutorships.com" required />
        <h3>PASSWORD:</h3>
        <input type="password" v-model="password" placeholder="Password" required />

        <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>
      </div>
      <div class="buttonsContent">
        <button id="logingButton" @click="login()">INICIAR SESIÓN</button>
        <button class="cancelButton" @click="cancelLogin()">CANCELAR</button>
        <router-link class="simpleLink" :to="{ name: 'RecoverPassword' }">¿Olvidaste tu contraseña?</router-link>
        <div class="registerContent">
          <p>¿No tienes cuenta?</p>
          <button id="button3" @click="$router.push('/registrate')">¡Regístrate!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setAuthToken, ENDPOINT } from "../utils/helpers";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showError: false,
      errorMessage: "",
      imageSource: "",
    };
  },
  methods: {
    cancelLogin() {
      this.email = "";
      this.password = "";
      this.$router.push("/");
    },
    async login() {
      if (this.email === "" || this.password === "") {
        this.showError = true;
        this.errorMessage = "Debes llenar todos los campos";
      } else {
        try {
          let data = {
            email: this.email,
            password: this.password,
          };

          const response = await axios.post(ENDPOINT + "/users/login", data);
          await setAuthToken(response.data.data);
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
  height: 90vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
  margin: 2rem;
}
.loginContent h3,
.loginContent input {
  margin-top: 1rem;
}
.loginInputs {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.buttonsContent {
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
}

.simpleLink {
  margin-top: 2rem;
}
.registerContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
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
    background-image: url("../assets/login-IMG-tablet.jpg");
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
    margin: 0;
    height: 100vh;
  }
  .loginContent {
    flex-grow: 1;
    max-width: 40vh;
    margin: 0 auto;
  }
}

@media only screen and (min-width: 1200px) {
  .backgroundImage {
    display: flex;
    height: 100vh;
    width: 55vw;
    background-image: url("../assets/login-IMG-desk.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
