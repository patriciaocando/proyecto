<template>
  <div>
    <ShowQuestionsAnswer
      :questions="UserQuestion"
      :answer="UserAnswers"
      :count="count"
      v-on:questionData="getQuestionData"
      v-show="showQuestion"
    />
    <div v-show="noQuestions">
      <p>Aww... aun no has preguntado nada aún</p>
      <p>¿Quieres hacer una?</p>
      <router-link :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
    </div>

    <!--EDITAR PREGUNTA-->
    <div v-show="hideQuestion">
      <h2>EDITAR PREGUNTA:</h2>
      <h3>TITULO:</h3>
      <input type="text" :placeholder="title" v-model="title" />
      <textarea type="text" name="textQuestion" rows="4" :placeholder="content" v-model="content"></textarea>
      <p v-show="showError">{{ errorMessage }}</p>
      <button @click="deleteQuestion()">Borrar pregunta</button>
      <div>
        <button @click="saveEdition()">GUARDAR</button>
        <button class="cancelButton" @click="cancelEdition()">CANCELAR</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import question from "@/components/Question.vue";

import {
  getAuthToken,
  getIdToken,
  alertFunction,
  config,
  ENDPOINT,
} from "../utils/helpers";

import ShowQuestionsAnswer from "@/components/GetQuestionAnswer.vue";

export default {
  name: "UserQuestions",
  data() {
    return {
      UserQuestion: [],
      UserAnswers: [],
      token: "",
      hideQuestion: false,
      showQuestion: true,
      noQuestions: false,
      count: "",

      //variables de gestion de errores
      showError: false,
      errorMessage: "",

      //Variables de componente
      title: "",
      content: "",
      idQuestion: "",
    };
  },
  components: {
    ShowQuestionsAnswer,
    question,
  },

  methods: {
    //DESDE LA VISTA
    cancelEdition() {
      this.title = "";
      this.content = "";
      this.hideQuestion = false;
      this.showQuestion = true;
    },
    //DESDE EL COMPONENTE
    getQuestionData(questionData) {
      this.hideQuestion = true;
      this.showQuestion = false;
      this.title = questionData.title;
      this.content = questionData.question_text;
      this.idQuestion = questionData.id;
    },
    //DESDE LA BBDD
    async getQuestionsAnwer() {
      try {
        const response = await axios.get(
          ENDPOINT + "/my-questions/",

          {
            headers: {
              Authorization: getAuthToken(),
            },
          }
        );

        let resultNumber = response.data.resultAnswers;
        if (resultNumber.length === 0) {
          this.noQuestions = true;
        } else {
          this.UserQuestion = response.data.resultAnswers;
        }
        /* console.log();
        if (response.data.resultAnswers[0].answer.length === 0) {
          this.count = "NO HAY RESPUESTAS AÚN";
        } else {
          this.count = response.data.resultAnswers[0].answer.length;
          this.UserAnswers = response.data.resultAnswers[0].answer;
        } */
      } catch (error) {
        this.showError = true;
        console.log(error);
        this.errorMessage = error.response.data.message;
      }
    },
    async saveEdition() {
      //DATA
      let data = {
        title: this.title,
        content: this.content,
      };

      try {
        const response = await axios.put(
          ENDPOINT + "/edit-question/" + this.idQuestion,
          data,
          config
        );
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }

      //ALERT DE EDITAR
      alertFunction(
        "success",
        "Actualizado",
        `Has editado tu pregunta exitosamente`
      );
      setTimeout(function () {
        location.reload();
      }, 1000);
    },
    async deleteQuestion() {
      try {
        const response = await axios.delete(
          ENDPOINT + "/delete-question/" + this.idQuestion,
          config
        );
        alertFunction("Borrada!", "Tu pregunta ha sido borrada.", "success");
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }

      //ALERT DE EDITAR
      /* Swal.fire({
        title: "¿Estas seguro que quieres borrar esta pregunta?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí!, BORRALA",
      }).then((result) => {
        if (result.value) {

          

           setTimeout(function () {
            location.reload();
          }, 1000); 
        }
      }); */
    },
  },
  async created() {
    this.token = getAuthToken();
    this.getQuestionsAnwer();
  },
};
</script>

<style scoped></style>
