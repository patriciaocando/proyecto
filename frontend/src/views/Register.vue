<template>
  <div class="allContent">
    <vue-headful title="¡Regístrate! | TutorShip" description="Registro en TutorShip" />
    <div class="backgroundImage">
      <!--DIV PARA COLOCAR LA IMAGEN DE TUTORSHIPS-->
    </div>

    <div class="registerContent" v-show="registerShow">
      <figure>
        <img
          class="logoTutor"
          src="../assets/logoTutorShips.png"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>

      <!-- FORMULARIO DE REGISTRO -->
      <div class="registerInputs">
        <h2>Regístrate:</h2>
        <h3>EMAIL:</h3>
        <input type="email" v-model="email" placeholder="miemail@tutorships.com" />
        <h3>NOMBRE DE USUARIO:</h3>
        <input @click="showText()" type="text" v-model="username" placeholder="youngcoderpadawan" />
        <p
          class="accesibilityTxt"
          v-show="coment"
        >Puedes usar letras, númenos y signos de puntuación.</p>

        <h3>CONTRASEÑA:</h3>
        <input @click="showTextPass()" type="password" v-model="password" placeholder="********" />
        <p class="accesibilityTxt" v-show="comentPass">
          Usa 8 o más caracteres con una combinación de letras, números y
          símbolos.
        </p>
        <h3>REPITE LA CONTRASEÑA:</h3>
        <input type="password" v-model="confirmpassword" placeholder="*******" />

        <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>
        <div class="buttonsContent">
          <button @click="registerUser()">¡Registrarme!</button>
          <button class="cancelButton" @click="cancelAction()">Cancelar</button>
          <div class="loginContent">
            <p>¿Ya tienes cuenta?</p>
            <button id="button3" @click="$router.push('/login')">¡Inicia sesión!</button>
          </div>
        </div>
      </div>
    </div>
    <!-- DIV REVISA TU EMAL -->
    <div class="registerAlert" v-show="validationShow">
      <figure>
        <img src="../assets/logoTutorShips.png" alt="logo-tutorships" />
      </figure>
      <h1>¡Revisa tu email!</h1>
      <router-link class="button" :to="{ name: 'Home' }">IR AL HOME</router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import { alertFunction } from "../utils/helpers";
export default {
  name: "Register",
  data() {
    return {
      //variables de componente
      email: "",
      username: "",
      password: "",
      confirmpassword: "",

      //variables de vista
      registerShow: true,
      validationShow: false,

      validationUrl: "",
      coment: false,
      comentPass: false,

      //variables de gestion de errores
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    showText() {
      this.coment = true;
    },
    showTextPass() {
      this.comentPass = true;
    },
    async registerUser() {
      let registerData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      if (this.confirmpassword === "") {
        this.showError = true;
        this.errorMessage = "Confirma tu contraseña";
      }

      if (this.password !== this.confirmpassword) {
        this.showError = true;
        this.errorMessage = "Tus contraseñas deben coincidir";
      } else {
        this.comentPass = false;
        this.coment = false;

        try {
          const response = await api.newUser(registerData);
          this.validationUrl = response.activationUrl;

          await alertFunction(
            "success",
            "Registro Exitoso",
            `Confirma tu email ${this.email} para activar tu cuenta en Tutorships.
          Recuerda revisar un carpeta de SPAM`
          );
          this.validationShow = true;
          this.registerShow = false;
        } catch (error) {
          this.showError = true;
          this.errorMessage = error;
        }
      }
    },
    cancelAction() {
      this.email = "";
      this.username = "";
      this.password = "";
      this.confirmpassword = "";
      this.$router.push({ name: "Home" });
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

.buttonsContent {
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
}

.loginContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 1rem;
}

.registerAlert {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}

.registerAlert h1 {
  margin: 2rem;
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
    background-image: url("../assets/register-IMG-tablet.jpg");
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
    background-image: url("../assets/register-IMG-desk.jpg");
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
