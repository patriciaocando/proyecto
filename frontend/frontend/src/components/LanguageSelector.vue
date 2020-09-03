<template>
  <div>
    <h3>LENGUAJE(S):</h3>
    <!--   {{ languages }} -->
    <!-- <label for="language">Escoge el lenguaje o tecnología</label> -->
    <select id="aviableLanguages" @change="onChange($event)">
      <option>Selecciona un lenguaje:</option>
      <option
        v-for="language in languages"
        :key="language.id"
        :value="language.id"
        :disabled="isDisable(language.id)"
      >{{ language.language }}</option>
    </select>

    <div class="tagsContainer" v-show="seeLanguages">
      <button
        id="languageTag"
        v-for="languageChosen in selectedLanguages"
        :key="languageChosen.id"
        :class="'languageStyle ' + languageChosen.name.toLowerCase()"
        @click="deleteTagLanguage(languageChosen.id)"
      >{{ languageChosen.name }} x</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector",
  props: {
    languages: Array,
  },
  data() {
    return {
      seeLanguages: false,
      selectedLanguages: [],
      selectedUserLanguages: [],
      datalanguages: [],
    };
  },

  methods: {
    deleteTagLanguage(id) {
      !this.isDisable(id);

      for (const language of this.selectedLanguages) {
        if (language.id === id) {
          let index = this.selectedLanguages.indexOf(language);
          this.selectedLanguages.splice(index, 1);
        }
      }
    },
    isDisable(id) {
      return this.selectedLanguages.some((item) => item.id === id);
    },
    //ESCUCHO LOS LENGUAJES SELECCIONADOS
    //ENVÍO ID A LA VISTA
    //ENVIO ID A LA FUNCION ANTERIOR
    onChange(event) {
      this.seeLanguages = true;
      let id = Number(event.target.value);
      this.$emit("disableErrorMsg");
      //BUSCO EL NOMBRE DEL LENGUAJE PARA MOSTRARLO
      for (const language of this.languages) {
        if (language.id === id) {
          this.selectedLanguages.push({
            id: language.id,
            name: language.language,
          });
          this.languages.s;
        }
      }
      this.isDisable();

      this.selectedUserLanguages.push(id);
      this.$emit("languageId", this.selectedUserLanguages);
    },
  },
};
</script>

<style scoped>
h3 {
  padding: 1rem 0;
}
.tagsContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 1rem;
}

.tagsContainer p {
  padding: 0.5rem;
}
#languageTag {
  max-width: 120px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}
</style>
