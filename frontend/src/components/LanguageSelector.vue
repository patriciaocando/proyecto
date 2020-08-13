<template>
  <div>
    <div>
      <h3>LENGUAJE:</h3>
      <!-- <label for="language">Escoge el lenguage o tecnología</label> -->
      <select id="language" @change="onChange($event)">
        <option>Selecciona un lenguage:</option>
        <option
          v-for="language in languages"
          :key="language.id"
          :value="language.id"
        >{{language.name_language}}</option>
      </select>

      <p v-show="seeLanguages">{{ selectedLanguages }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector",
  data() {
    return {
      seeLanguages: false,
      selectedLanguages: [],
      selectedUserLanguages: [],
    };
  },
  props: {
    languages: Array,
  },
  methods: {
    //ESCUCHO LOS LENGUAJES SELECCIONADOS
    //ENVÍO ID A LA VISTA
    //ENVIO ID A LA FUNCION ANTERIOR
    onChange(event) {
      this.seeLanguages = true;

      let id = event.target.value;
      //BUSCO EL NOMBRE DEL LENGUAJE PARA MOSTRARLO
      for (const language of this.languages) {
        if (language.id === Number(id)) {
          this.selectedLanguages.push(language.name_language);
        }
      }

      this.selectedUserLanguages.push(id);
      console.log(this.selectedUserLanguages);
      this.$emit("languageId", this.selectedUserLanguages);
    },
  },
};
</script>

<style scoped>
</style>