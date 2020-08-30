<template>
  <div class="container">
    <!--LENGUAGES DE EXPERTO-->
    <h1>Lenguajes asociados:</h1>
    <div class="languageContainer" v-for="language in userLanguages" :key="language.id">
      <img class="languageImage" :src="getImageName(language.image)" />
      <div class="content">
        <span class="languageTxt">
          <h2>{{ language.language }}</h2>
          <p>{{ language.description }}</p>
        </span>
        <span class="buttonContainer">
          <button class="deleteButton" @click="deleteUserLanguage(language.id)">Borrar lenguaje</button>
        </span>
      </div>
    </div>
    <p v-show="showError">{{ errorMessage }}</p>

    <!--TODOS LOS LENGUAGES-->
    <div class="allLanguages">
      <h1>Todos los lenguajes:</h1>
      <div class="languageContainer" v-for="languages in bbddLanguages" :key="languages.id">
        <img class="languageImage" :src="getImageName(languages.image)" />
        <div class="content">
          <span class="languageTxt">
            <h2>{{ languages.language }}</h2>
            <p>{{ languages.description }}</p>
          </span>
          <span class="buttonContainer">
            <button @click="addLanguage(languages.id)">ASOCIAR A LENGUAJE</button>
          </span>
        </div>
      </div>
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
export default {
  name: "ExpertLanguages",

  data() {
    return {
      userLanguages: [],
      bbddLanguages: [],
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      sharedStore: userData.state,
    };
  },
  computed: {
    token() {
      return this.sharedStore.token;
    },
    userRole() {
      return this.sharedStore.role;
    },
  },

  methods: {
    getImageName(name) {
      let url = process.env.VUE_APP_STATIC;
      return url + name;
    },
    //TRAER LOS LENGUAJES ASOCIADOS A UN EXPERTO
    async getUserLanguages() {
      if (this.userRole === "experto") {
        try {
          const response = await axios.get(ENDPOINT + "/expert/languages", {
            headers: {
              Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
            },
          });

          this.userLanguages = response.data.data;
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    //TRAER LOS LENGUAJES DE LA BBDD
    async getLanguages() {
      try {
        await this.getUserLanguages();
        const response = await axios.get(ENDPOINT + "/languages");
        this.bbddLanguages = response.data.data;

        for (const language of this.userLanguages) {
          for (const [index, bbddlanguageAux] of this.bbddLanguages.entries()) {
            if (language.id === bbddlanguageAux.id) {
              this.bbddLanguages.splice(index, 1);
            }
          }
        }
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //BORRAR LENGUAJE DE UN EXPERTO
    async deleteUserLanguage(languageId) {
      try {
        const response = await axios.delete(
          ENDPOINT + "/users/delete-language/" + languageId,
          {
            headers: {
              Authorization: localStorage.getItem("AUTH_TOKEN_KET"),
            },
          }
        );
        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //ASOCIAR UN NUEVO LENGUAJE
    async addLanguage(languageId) {
      console.log(languageId);
      try {
        let data = {
          newlanguage: languageId,
        };
        const response = await axios.put(
          ENDPOINT + "/users/add-language",
          data,
          config
        );
        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.getLanguages();
  },
};
</script>

<style scoped>
.languageImage {
  width: 120px;
  height: 120px;
  border-radius: 8px;
}

.allLanguages {
  margin-top: 3rem;
  background-color: var(--ligthBlue);
}
.allLanguages h1 {
  padding-top: 2rem;
  padding-left: 1.5rem;
}
.languageContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 1em 1rem;
  border-bottom: 1px solid var(--ligthColor);
  padding: 2rem;
}

.languageTxt {
  margin: 0 1rem;
}

.deleteButton {
  align-items: flex-end;
  margin-top: 2rem;
}
.allLanguages h3 {
  margin-top: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 80%;
}
.buttonContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
}
</style>
