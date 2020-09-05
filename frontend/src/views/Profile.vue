<template>
  <div class="container">
    <vue-headful
      title="Perfil de Usuario |  Tutorship"
      description="Perfil de usuario de TUtorShip"
    />
    <!--DATOS DE USUARIO-->

    <userprofile :currentUser="currentUser" @iduserupdate="updateUserData" :cancel="deleteError" />
    <p v-show="showError">{{ errorMessage }}</p>
    <!--CAMBIO DE CONTRASEÑA-->
    <div>
      <changepassword :actualPassword="actualPassword" v-on:changePassword="postNewPassword" />
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api";
//utilidades
import { alertFunction } from "../utils/helpers";
import { cloneDeep } from "lodash";

//componentes
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
      userLanguages: [],

      actualPassword: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //DATA DE USUARIO
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
    currentUser() {
      return cloneDeep(this.sharedStore);
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
        const response = await api.updateUserProfile(this.userId, formData);
        const updatedUser = await api.getUserProfile(this.userId);

        this.sharedStore.username = updatedUser.username;
        this.sharedStore.avatar =
          process.env.VUE_APP_STATIC + updatedUser.avatar;
        this.sharedStore.email = updatedUser.email;
        this.sharedStore.name = updatedUser.name;
        this.sharedStore.lastname = updatedUser.lastName;
        this.sharedStore.profile = updatedUser.profile;

        //traer el perfil de usurio desde la bbdd

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
        this.sharedStore.lastname = null;
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
