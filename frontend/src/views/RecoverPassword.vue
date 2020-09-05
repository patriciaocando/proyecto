<template>
  <div class="allContent">
    <vue-headful title="Password | TutorShip" description="Pagina de ecuperación de contraseña" />
    <div class="backgroundImage"></div>

    <div class="recoverContent" v-show="!showRecoverCode">
      <figure>
        <img
          class="logoTutor"
          src="../assets/logoTutorShips.png"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>
      <div class="recoverInputs">
        <h1>¿Olvidaste tu contraseña?</h1>
        <p>Escribe tu email, te enviaremos un código para researla</p>
        <h3>EMAIL:</h3>
        <input type="email" v-model="email" placeholder="miemail@tutorships.com" required />
        <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>
      </div>
      <div class="buttonsContent">
        <button @click="sendRecoverCode">ENVIAR</button>
        <button class="cancelButton" @click="cancelRecoverCode()">CANCELAR</button>
      </div>
    </div>

    <div class="recoverContent" v-show="showRecoverCode">
      <figure>
        <img
          class="logoTutor"
          src="../assets/logoTutorShips.png"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>
      <div class="recoverInputs">
        <h1>Resetea tu contraseña</h1>
        <h3>CÓDIGO DE RESETEO DE CONTRASEÑA:</h3>
        <input type="text" v-model="recoverCode" required />
        <h3>NUEVA CONTRASEÑA:</h3>
        <input type="password" v-model="newPassConfirm" placeholder="**********" required />
        <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>
      </div>
      <div class="buttonsContent">
        <button @click="sendResetPassword">ENVIAR</button>
        <button class="cancelButton" @click="cancelRecoverCode()">CANCELAR</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { alertFunction } from "../utils/helpers";

export default {
  name: "RecoverPasword",
  data() {
    return {
      email: "",
      recoverCode: "",
      newPassConfirm: "",
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
          const response = await api.recoverPassword(data);

          this.showRecoverCode = true;
        } catch (error) {
          this.showError = true;
          this.errorMessage = error;
        }
      }
    },
    async sendResetPassword() {
      if (this.newPassConfirm === "" || this.recoverCode === "") {
        this.showError = true;
        this.errorMessage =
          "Debes ingresar todos los campos para resetear tu contraseña.";
      } else {
        try {
          let data = {
            recoverCode: this.recoverCode,
            newPassword: this.newPassConfirm,
          };

          const response = await api.resetPassword(data);

          alertFunction(
            "success",
            "Has reseteado tu contraseña",
            `Has login para entrar de nuevo a TutorShip`
          );
          this.$router.push("/login");
        } catch (error) {
          this.showError = true;
          this.errorMessage = error;
        }
      }
    },
    cancelRecoverCode() {
      this.recoverCode = "";
      this.newPassConfirm = "";
      this.email = "";
      this.showError = false;
      this.showRecoverCode = false;

      this.$router.push("/");
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
  text-align: left;
  height: 90vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  margin: 2rem;
}
.recoverContent h3,
.recoverContent input {
  margin-top: 1rem;
}
.recoverInputs {
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.recoverInputs p {
  margin: 1rem 0;
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
    background-image: url("../assets/recoverpass-IMG-tablet.jpg");
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
  .recoverContent {
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
    background-image: url("../assets/recoverpass-IMG-desk.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>