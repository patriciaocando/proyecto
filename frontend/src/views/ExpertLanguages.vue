<template>
  <div class="container">
    <vue-headful title="Lenguajes | Tutorship" description="Lenguajes de experto" />
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
            <button @click="addLanguage(languages.id,languages.language)">ASOCIAR A LENGUAJE</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api";

import { alertFunction } from "../utils/helpers";
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
          const response = await api.getUserLanguages();
          this.userLanguages = response;
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

        const response = await api.getLanguages();
        this.bbddLanguages = response;

        for (const language of this.userLanguages) {
          for (const [index, bbddlanguageAux] of this.bbddLanguages.entries()) {
            if (language.id === bbddlanguageAux.id) {
              this.bbddLanguages.splice(index, 1);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    //BORRAR LENGUAJE DE UN EXPERTO
    async deleteUserLanguage(idLanguage) {
      try {
        if (this.userLanguages.length <= 1) {
          alertFunction(
            "warning",
            "Upss!",
            "Debes tener por lo menos un lenguaje asociado"
          );
        } else {
          const response = await api.deleteLanguageExpert(idLanguage);

          await this.getUserLanguages();
          await this.getLanguages();
        }
      } catch (error) {
        console.error(error);
      }
    },
    //ASOCIAR UN NUEVO LENGUAJE
    async addLanguage(languageId, languageName) {
      try {
        let data = {
          newlanguage: languageId,
        };
        const response = await api.newLanguageExpert(data);
        await alertFunction(
          "success",
          "Nuevo lenguaje",
          `Has asociado tu perfil al lenguaje: ${languageName}.`
        );
        await this.getUserLanguages();
        await this.getLanguages();
      } catch (error) {
        console.error(error);
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
