<template>
  <div class="container">
    <!--DATOS DE USUARIO-->

    <userprofile
      v-on:iduserupdate="updateUserData"
      :userdata="profile"
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

import axios from "axios";
import Swal from "sweetalert2";
import {
  getAuthToken,
  getIdToken,
  alertFunction,
  getRoleToken,
  config,
  ENDPOINT,
} from "../utils/helpers";

import userprofile from "@/components/UserProfile.vue";
import changepassword from "@/components/ChangePassword.vue";

export default {
  name: "Profile",
  components: {
    userprofile,
    changepassword,
  },

  data() {
    return {
      //variables de vista
      profile: {},
      userLanguages: [],
      userRole: "",
      actualPassword: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //TOKEN
      sharedStore: userData.state,
    };
  },
  computed: {
    token() {
      return this.sharedStore.token;
    },
    userId() {
      return this.sharedStore.id;
    },
  },

  methods: {
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
        const response = await axios.put(
          ENDPOINT + "/users/edit-profile/" + this.userId,
          formData,
          {
            headers: {
              Authorization: this.token,
            },
          },
          { header: { "Content-type": "multipart/form-data" } }
        );
        //ALERT DE EDITAR
        await alertFunction(
          "success",
          "Actualizado",
          `Has editado los datos de ${userData.username} exitosamente`
        );
        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //TRAIGO LA INFO DEL PERFIL DE USUARIO DE LA BBDD
    async getUserProfile() {
      try {
        const response = await axios.get(
          ENDPOINT + "/users/profile/" + this.userId,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        this.profile = response.data.data;
        this.profile.avatar = process.env.VUE_APP_STATIC + this.profile.avatar;
        this.actualPassword = response.data.data.password;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //CAMBIO DE CONTRASEÑA EN LA BBDD
    async postNewPassword(data) {
      try {
        console.log(data);
        const response = await axios.post(
          ENDPOINT + `/users/${this.userId}/password`,
          data,
          {
            headers: {
              Authorization: this.token,
            },
          }
        );
        alertFunction(
          "success",
          "NUEVA CONTRASEÑA",
          "Has actualizado tu contaseña con éxito, haz Login de nuevo"
        );
        this.$router.push("/login");
      } catch (error) {
        console.log(error);
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  /*  created() {
    this.getUserProfile();
  }, */
};
</script>

<style scoped></style>
