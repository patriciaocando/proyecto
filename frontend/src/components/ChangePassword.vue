<template>
  <div>
    <div v-show="hideActualPass">
      <h2>SEGURIDAD:</h2>
      <h3>CONTRASEÑA:</h3>
      <p>**********</p>
      <button @click="showEdition()">CAMBIAR CONTRASEÑA</button>
    </div>
    <div v-if="activateEdition">
      <h3>CONTRASEÑA ACTUAL:</h3>
      <input class="password" type="password" v-model="actualPass" required />

      <div class="newPasswordContainer">
        <h3>CONTRASEÑA NUEVA:</h3>
        <input type="password" v-model="newPass" required />
        <p
          class="accesibilityTxt"
        >Usa 8 o más caracteres con una combinación de letras números y símbolos</p>
        <h3>CONFIRMA CONTRASEÑA NUEVA:</h3>
        <input type="password" v-model="confirmNewPass" required />
      </div>
      <p class="accesibilityTxtalert" v-show="showError">{{ errorMessage }}</p>
      <button @click="sendPassword()">GUARDAR CONTRASEÑA</button>
      <button class="cancelButton" @click="cancelEditionPass()">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangePassword",

  data() {
    return {
      actualPass: "",
      newPass: "",
      confirmNewPass: "",
      activateEdition: false,
      hideActualPass: true,
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    showEdition() {
      this.activateEdition = true;
      this.hideActualPass = false;
    },

    sendPassword() {
      if (this.confirmNewPass !== this.newPass) {
        this.showError = true;
        this.errorMessage = "No coinciden las contraseñas";
      } else {
        let data = {
          currentPassword: this.actualPass,
          newPassword: this.newPass,
        };
        this.$emit("changePassword", data);
      }
    },
    cancelEditionPass() {
      this.actualPass = "";
      this.newPass = "";
      this.confirmNewPass = "";
      this.activateEdition = false;
      this.hideActualPass = true;
    },
  },
};
</script>

<style scoped>
</style>