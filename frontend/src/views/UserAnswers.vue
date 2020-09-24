<template>
  <div class="container">
    <vue-headful
      title="Respuestas de experto | TutorShip"
      description="Página de las respuesta que ha realizado el experto"
    />
    <span id="sectionTitle">
      <h1>Tus respuestas</h1>
      <h2>Aquí puedes ver las respuestas que has realizado</h2>
    </span>

    <answer
      :answers="bbddAnswers"
      :editAnswer="editAnswer"
      @editedAnswer="postEditedAnswer"
      @deleteAnswer="deleteAnswer"
    />
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import { alertFunction } from "../utils/helpers";

import answer from "@/components/Answer.vue";
import api from "@/api/api.js";

export default {
  name: "UserAnswers",
  components: {
    answer,
  },
  data() {
    return {
      //Variable de vista
      bbddAnswers: [],

      editAnswer: false,
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      sharedStore: userData.state,
    };
  },
  computed: {
    route() {
      return this.$route.name;
    },
  },
  methods: {
    //TRAER RESPUESTAS HECHAS POR EL USUARIO DESDE LA BBDD
    async getAnswers() {
      try {
        const response = await api.getAnswers();
        this.bbddAnswers = response;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    async postEditedAnswer(componentData) {
      try {
        let idAnswer = componentData.id;
        let data = {
          content: componentData.currentAnswer,
        };
        const response = await api.editAnswer(idAnswer, data);
        if (response !== null) {
          alertFunction("success", "Editada!", "Tu respuesta ha sido editada.");
          await this.getAnswers();
        }
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
    async deleteAnswer(idAnswer) {
      try {
        const response = await api.deleteAnswer(idAnswer);
        if (response !== null) {
          alertFunction("success", "Borrada!", "Tu respuesta ha sido borrada.");
        }
        await this.getAnswers();
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getAnswers();
  },
};
</script>

<style scoped>
</style>
