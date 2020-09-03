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
        <input id="editAvatar" type="file" ref="avatarLoad" @change="getImageUpload" />
        <p>{{ avatarLoad.name }}</p>
      </span>

      <span class="dataProfile">
        <h3>USERNAME:</h3>
        <input type="text" v-model="currentUser.username" />
        <h3>NOMBRE:</h3>
        <input type="text" v-model="currentUser.name" />
        <h3>APELLIDO:</h3>
        <input type="text" v-model="currentUser.lastname" />
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
        lastname: this.currentUser.lastname,
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
  width: 50%;
}
.avatarContent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profileContainer {
  text-align: center;
}
.profileContainer h2 {
  margin-bottom: 2rem;
}
.content {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.dataProfile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  max-width: 60vw;
}
.dataProfile p {
  margin-bottom: 2rem;
}
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatarProfile {
  width: 100px;
  height: 100px;
  border-radius: 80px;
}

@media only screen and (min-width: 900px) {
  #editAvatar {
    border: none;
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
    align-items: flex-start;
    justify-content: stretch;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .avatarContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 18rem;
  }
  .dataProfile {
    text-align: left;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 1rem;
    width: 40%;
    margin-top: 0;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
