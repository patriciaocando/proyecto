<template>
  <div>
    <vue-headful title="¡Regístrate! | TutorShip" description="Registro en TutorShip" />
    <div>
      <!--DIV PARA COLOCAR LA IMAGEN DE TUTORSHIPS-->
    </div>

    <div>
      <img src="../assets/logoTutorShips.png" />
      <!-- FORMULARIO DE REGISTRO -->
      <div v-show="registerShow">
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

        <p class="accesibilityTxtalert" v-show="showError">{{ errorMessage }}</p>
        <button class="cancelButton" @click="cancelAction()">Cancelar</button>
        <button @click="registerUser()">¡Registrarme!</button>
      </div>
      <!-- DIV REVISA TU EMAL -->
      <div v-show="registerHide">
        <h1>¡Revisa tu email!</h1>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { alertFunction, ENDPOINT, config } from "../utils/helpers";

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
      registerHide: false,
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
        this.errorMessage = "Tus contraseña debe coincidir";
      } else {
        try {
          const response = await axios.post(
            ENDPOINT + "/new-user",
            registerData
          );

          this.validationUrl = response.data.activationUrl;

          await alertFunction(
            "success",
            "Registro Exitoso",
            `Confirma tu email ${this.email} para activar tu cuenta en Tutorships.
          Recuerda revisar un carpeta de SPAM`
          );
          this.registerShow = false;
          this.registerHide = true;
        } catch (error) {
          console.log(error);
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    cancelAction() {
      this.email = "";
      this.username = "";
      this.password = "";
      this.confirmpassword = "";
    },
  },
};
</script>

<style scoped></style>
