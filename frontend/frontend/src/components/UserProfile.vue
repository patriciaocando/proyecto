<template>
  <div class="profileContainer">
    <h2>DATOS PERSONALES:</h2>

    <div class="content" v-if="!isEdit">
      <span class="avatarContent">
        <img class="avatarProfile" :src="currentUser.avatar" />
      </span>

      <span class="dataProfile">
        <h3>USERANAME:</h3>
        <p>{{ currentUser.username }}</p>
        <h3>NOMBRE:</h3>
        <p>{{ currentUser.name }} {{ currentUser.lastname }}</p>
        <h3>ROL:</h3>
        <p>{{ currentUser.role }}</p>
        <h3>EMAIL:</h3>
        <p>{{ currentUser.email }}</p>
        <h3>BIO:</h3>
        <p>{{ currentUser.profile }}</p>
      </span>
      <span class="buttons">
        <button @click="seeProfile()">Editar Perfil</button>
      </span>
    </div>

    <div class="content" v-if="isEdit">
      <span class="avatarContent">
        <img class="avatarProfile" :src="sharedStore.avatar" />
        <input
          id="editAvatar"
          type="file"
          ref="avatarLoad"
          @change="getImageUpload"
        />
        <p>{{ avatarLoad.name }}</p>
      </span>

      <span class="dataProfile">
        <h3>USERANAME:</h3>
        <input type="text" v-model="currentUser.username" />
        <h3>NOMBRE:</h3>
        <input type="text" v-model="currentUser.name" />
        <h3>APELLIDO:</h3>
        <input type="text" v-model="currentUser.lastName" />
        <h3>EMAIL:</h3>
        <input type="text" v-model="currentUser.email" />
        <h3>BIO:</h3>
        <input type="textarea" v-model="currentUser.profile" />
      </span>

      <span class="buttons">
        <button @click="updateProfile()">Guardar Perfil</button>
        <button class="cancelButton" @click="cancelEdition()">Cancelar</button>
      </span>
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import { cloneDeep } from "lodash";

export default {
  name: "UserProfile",
  props: {
    currentUser: Object,
  },

  data() {
    return {
      avatarLoad: "",
      isEdit: false,
      sharedStore: userData.state,
    };
  },

  methods: {
    getImageUpload() {
      this.avatarLoad = this.$refs.avatarLoad.files[0];
      console.log("avatar", this.avatarLoad);
    },

    seeProfile() {
      this.isEdit = true;
    },
    updateProfile() {
      const userData = {
        name: this.currentUser.name,
        lastname: this.currentUser.lastName,
        username: this.currentUser.username,
        email: this.currentUser.email,
        profile: this.currentUser.profile,
        avatar: this.avatarLoad,
      };
      this.isEdit = false;
      this.$emit("iduserupdate", userData);
    },
    cancelEdition() {
      this.isEdit = false;
    },
  },
};
</script>

<style scoped>
#editAvatar {
  border: none;
  /*  background-color: royalblue; */
  width: 50%;
}

.profileContainer {
  text-align: left;
}
.profileContainer h2 {
  margin-bottom: 2rem;
}
.content {
  display: flex;
  flex-direction: row;
  text-align: left;
  align-items: space-evenly;
  justify-content: stretch;
  align-content: center;
  flex-wrap: wrap;
  width: 100%;
}
.avatarContent {
  height: 30rem;
  width: 15rem;
  /* background-color: salmon; */
}
.dataProfile {
  display: flex;
  flex-direction: column;
  align-items: space-around;
  justify-content: stretch;
  align-content: space-around;
  padding-right: 2rem;
  /* background-color: seagreen; */
  width: 25rem;
}
.dataProfile p {
  margin-bottom: 2rem;
}
.buttons {
  width: 15rem;
  /*  background-color: skyblue; */
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* .currentProfile p,
.currentProfile h3 {
  margin-bottom: 1rem;
} */
.avatarProfile {
  width: 154px;
  height: 154px;
  border-radius: 80px;
}
</style>
