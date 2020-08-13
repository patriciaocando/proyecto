<template>
  <div>
    <div>
      <p v-show="showError">{{ errorMessage }}</p>
      <answercomponent
        :answers="bbddAnswers"
        v-on:editedAnswer="getComponentData"
        v-on:deleteAnswer="deleteAnswer"
      />
      <!--EDITAR RESPUESTA-->
      <div v-show="editAnswer" class="answerEdit">
        <div>
          <textarea type="text" name="textAnswer" rows="4" v-model="currentAnswer"></textarea>

          <button @click="deleteAnswer(idAnswerEdit)">Borrar respuesta</button>
        </div>
        <button @click="postEditedAnswer(idAnswerEdit)">GUARDAR</button>
        <button @click="cancelRequest()">CANCELAR</button>
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
      //Variable de componente
      editAnswer: false,
      //Variable de vista
      bbddAnswers: [],
      currentAnswer: "",
      idAnswerEdit: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    //TRAER DESDE EL COMPONENTE LOS DATOS DE LA PREGUNTA PARA EDITAR
    getComponentData(data) {
      this.editAnswer = true;
      this.currentAnswer = data.currentAnswer;
      this.idAnswerEdit = data.id;
      console.log(data);
    },
    //TRAER RESPUESTAS HECHAS POR EL USUARIO DESDE LA BBDD
    async getAnswers() {
      try {
        const response = await axios.get(ENDPOINT + "/answer", config);
        this.bbddAnswers = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async postEditedAnswer(id) {
      try {
        let data = {
          content: this.currentAnswer,
        };

        const response = await axios.put(
          ENDPOINT + "/edit-answer/" + id,
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

        alertFunction("Borrada!", "Tu respuesta ha sido borrada.", "success");

        location.reload();
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    cancelRequest() {
      this.editAnswer = false;
      location.reload();
    },
  },
  created() {
    this.getAnswers();
  },
};
</script>

<style scoped></style>
