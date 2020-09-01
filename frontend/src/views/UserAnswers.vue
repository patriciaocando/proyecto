<template>
  <div class="container">
    <span id="sectionTitle">
      <h1>Tus respuestas</h1>
      <h2>Aquí puedes ver las respuestas que has realizado</h2>
    </span>
    <p v-show="showError">{{ errorMessage }}</p>
    <answercomponent
      :answers="bbddAnswers"
      v-on:editedAnswer="postEditedAnswer"
      v-on:deleteAnswer="deleteAnswer"
    />
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
  config,
  ENDPOINT,
} from "../utils/helpers";

import answercomponent from "@/components/AnswerComponent.vue";

export default {
  name: "UserAnswers",
  components: {
    answercomponent,
  },
  data() {
    return {
      //Variable de vista
      bbddAnswers: [],

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
    route() {
      return this.$route.name;
    },
  },
  methods: {
    //TRAER RESPUESTAS HECHAS POR EL USUARIO DESDE LA BBDD
    async getAnswers() {
      try {
        const response = await axios.get(ENDPOINT + "/answer", {
          headers: {
            Authorization: this.token,
          },
        });
        this.bbddAnswers = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async postEditedAnswer(componentData) {
      try {
        let data = {
          content: componentData.currentAnswer,
        };

        const response = await axios.put(
          ENDPOINT + "/edit-answer/" + componentData.id,
          data,
          config
        );

        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async deleteAnswer(idAnswer) {
      try {
        const response = await axios.delete(
          ENDPOINT + "/delete-answer/" + idAnswer,
          config
        );

        alertFunction("success", "Borrada!", "Tu respuesta ha sido borrada.");

        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  async created() {
    await this.getAnswers();
  },
};
</script>

<style scoped>
/* .answersContainer {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  align-content: space-between;
  background-color: dodgerblue;
}

@media only screen and (min-width: 600px) {
}
@media only screen and (min-width: 1200px) {
  .dashHomeContent {
    margin: 2rem;
    max-width: 65vw;
  }
  .answersContainer {
    margin-bottom: 3rem;
  }
} */
</style>
