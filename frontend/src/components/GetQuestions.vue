<template>
  <div>
    <div class="questionInfo" v-for="(question, index) in questions" :key="question.id">
      <!--AUTOR DE LA PREGUNTA-->
      <div class="autorInfo">
        <img class="avatar" :src="getImageName(question.avatar)" />
        <p>{{ question.name_user }}</p>
      </div>
      <h3>{{ question.title }}</h3>
      <!--METADATA FECHA-->
      <span>
        <p>
          Formulada: {{ getFormat(question.date) }} | Hace:
          {{ getDistance(question.date) }}
        </p>
        <p>{{ question.name_language }}</p>
      </span>
      <!--CONTENIDO PREGUNTA-->
      <p>{{ question.question_text }}</p>
      <!--METADATA RESPUESTAS-->
      <div>
        <p>
          ID {{ question.id }} RESPUESTAS
          <b>{{ question.answers }}</b>
          <button
            v-show="isUser"
            :class="{ hideButton: question.answers <= 0 }"
            @click="sendQuestionId(question.id, index)"
          >VER RESPUESTAS</button>
        </p>
      </div>
      <!--MOSTRAR LAS RESPUESTAS-->
      <div v-if="index === answer">
        <getanswer class="answerContent" :answers="answers" v-on:newVote="getRating" />
      </div>
    </div>
  </div>
</template>

<script>
import { getAuthToken } from "../utils/helpers";
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

import getanswer from "@/components/GetAnswer.vue";

export default {
  name: "ShowQuestions",
  components: {
    getanswer,
  },
  props: {
    questions: Array,
    answers: Array,
  },
  data() {
    return {
      idQuestion: 2,
      hideAnswers: true,
      seeAnswersButton: false,
      //variable para ocultar boton si no esta autenticado el usuario
      isUser: "",

      //Variable para saber el indice de la pregunta de la que se desea ver la respuesta
      answer: "",

      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    getRating(data) {
      this.$emit("rateAnswer", data);
    },
    getAutentication() {
      if (this.token === null) {
        this.isUser = false;
      } else {
        this.isUser = true;
      }
    },
    sendQuestionId(id, index) {
      this.answer = index;
      this.$emit("showAnswers", id);
    },
    getFormat(date) {
      return format(new Date(date), "dd/M/yyyy", { locale: es });
    },
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
    sendSearchParams() {
      let params = {
        name: this.autor,
        direction: this.order,
        search: this.search,
        language: this.language,
        date_init: this.dateInit,
        date_end: this.dateEnd,
        status: this.status,
      };
    },
    showFilter() {
      if (this.filter) {
        this.filter = false;
      } else {
        this.filter = true;
      }
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
  },
  created() {
    this.getAutentication();
  },
};
</script>

<style scoped>
.hideButton {
  display: none;
}
.answerContent {
  margin: 2rem;
  border: solid 1px darkgrey;
  padding: 1rem;
}

.hideQuestion {
  display: none;
}
.questionInfo {
  text-align: left;
}

.autorInfo {
  display: flex;
  flex-direction: row;
}
</style>
