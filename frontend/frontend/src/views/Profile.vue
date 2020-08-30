<template>
  <div class="container">
    <!--DATOS DE USUARIO-->

    <userprofile
      :currentUser="currentUser"
      @iduserupdate="updateUserData"
      :cancel="deleteError"
    />
    <p v-show="showError">{{ errorMessage }}</p>
    <!--CAMBIO DE CONTRASEÑA-->
    <div>
      <changepassword
        :actualPassword="actualPassword"
        v-on:changePassword="postNewPassword"
      />
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api";

import { alertFunction, ENDPOINT } from "../utils/helpers";

import userprofile from "@/components/UserProfile.vue";
import changepassword from "@/components/ChangePassword.vue";

import { cloneDeep } from "lodash";

export default {
  name: "Profile",
  components: {
    userprofile,
    changepassword,
  },

  data() {
    return {
      //variables de vista
      userLanguages: [],
      userRole: "",
      actualPassword: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //DATA DE USUARIO
      sharedStore: userData.state,
      /* currentUser: "", */
    };
  },
  computed: {
    token() {
      return this.sharedStore.token;
    },
    userId() {
      return this.sharedStore.id;
    },
    currentUser() {
      return cloneDeep(this.sharedStore);
    },
  },

  methods: {
    /* getUserProfile() {
      this.currentUser = cloneDeep(this.sharedStore);
    }, */
    deleteError() {
      this.showError = false;
    },
    async updateUserData(userData) {
      let formData = new FormData();
      //DATOS DEL USUARIO QUE RECIBO DESDE EL COMPONENTE
      formData.append("name", userData.name);
      formData.append("last_name", userData.lastname);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("profile_bio", userData.profile);
      formData.append("avatar", userData.avatar);

      try {
        const response = await api.updateUserProfile(this.userId, formData);

        this.sharedStore.username = userData.username;
        this.sharedStore.avatar =
          process.env.VUE_APP_STATIC + userData.avatar.name;
        this.sharedStore.email = userData.email;
        this.sharedStore.name = userData.name;
        this.sharedStore.lastName = userData.lastName;
        this.sharedStore.profile = userData.profile;

        await alertFunction(
          "success",
          "Actualizado",
          `Has editado los datos de ${userData.username} exitosamente`
        );
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },

    //CAMBIO DE CONTRASEÑA EN LA BBDD
    async postNewPassword(data) {
      try {
        const response = await api.updateUserpass(this.userId, data);

        alertFunction(
          "success",
          "NUEVA CONTRASEÑA",
          "Has actualizado tu contaseña con éxito, haz Login de nuevo"
        );
        this.sharedStore.id = null;
        this.sharedStore.role = null;
        this.sharedStore.token = null;
        this.sharedStore.username = null;
        this.sharedStore.avatar = null;
        this.sharedStore.email = null;
        this.sharedStore.name = null;
        this.sharedStore.lastName = null;
        this.sharedStore.profile = null;
        this.sharedStore.isLogged = false;
        api.logout();
        this.$router.push("/login");
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style scoped></style>
