<template>
  <div>
    <h3>LENGUAJES ASOCIADOS:</h3>
    <div v-for="language in userLanguages" :key="language.id">
      <img class="languageImage" :src="getImageName(language.image)" />
      <p>{{language.language}}</p>
      <p>{{language.description}}</p>
      <button @click="deleteUserLanguage(language.id)">Borrar lenguaje</button>
    </div>
    <p v-show="showError">{{ errorMessage }}</p>
    <div>
      <h3>TODOS LOS LENGUAJES:</h3>
      <div v-for="languages in bbddLanguages" :key="languages.id">
        <img class="languageImage" :src="getImageName(languages.image)" />
        <p>{{languages.language}}</p>
        <p>{{languages.description}}</p>
        <button @click="addLanguage(languages.id)">ASOCIAR A LENGUAJE</button>
      </div>
    </div>
  </div>
</template>

<script>
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
      userRole: "",
      //TOKEN
      token: getAuthToken(),
    };
  },

  methods: {
    getImageName(name) {
      let url = process.env.VUE_APP_STATIC;
      return url + name;
    },
    //TRAER LOS LENGUAJES ASOCIADOS A UN EXPERTO
    async getUserLanguages() {
      this.userRole = getRoleToken(this.token);

      if (this.userRole === "experto") {
        try {
          const response = await axios.get(
            ENDPOINT + "/expert/languages",
            config
          );

          this.userLanguages = response.data.data;
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.response.data.message;
        }
      }
    },
    //TRAER LOS LENGUAGES DE LA BBDD
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
          config
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
  width: 48px;
  height: 48px;
  border-radius: 8px;
}
</style>