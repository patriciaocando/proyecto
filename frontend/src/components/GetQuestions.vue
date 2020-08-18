<template>
  <div>
    <div class="questionContent">
      <div class="questionInfo" v-for="(question, index) in questions" :key="question.id">
        <!--AUTOR DE LA PREGUNTA-->
        <div class="autorInfo">
          <img class="avatar" :src="getImageName(question.avatar)" />
          <p>{{ question.name_user }}</p>
        </div>
        <h3>{{ question.title }}</h3>
        <!--METADATA FECHA-->

        <span class="dataMeta">
          <p class="accesibilityTxt">
            Formulada: {{ getFormat(question.date) }} | Hace:
            {{ getDistance(question.date) }}
          </p>
          <p
            :class="'languageStyle ' + question.name_language.toLowerCase()"
          >{{ question.name_language }}</p>
        </span>
        <!--CONTENIDO PREGUNTA-->
        <p class="lengthTxt">{{ question.question_text }}</p>
        <!--METADATA RESPUESTAS-->
        <div class="answerMeta">
          <h3>
            RESPUESTAS
            <b class="numberQuestions">{{ question.answers }}</b>
          </h3>
          <button
            v-show="isUser"
            :class="{ hideButton: question.answers <= 0 }"
            @click="sendQuestionId(question.id, index)"
          >{{buttonText}}</button>
        </div>
        <!--MOSTRAR LAS RESPUESTAS-->
        <div v-show="hideAnswer" class="answerContent" v-if="index === answer">
          <getanswer :answers="answers" v-on:newVote="getRating" />
        </div>
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
      hideAnswer: true,
      //variable para ocultar boton si no esta autenticado el usuario
      isUser: "",

      //Variable para saber el indice de la pregunta de la que se desea ver la respuesta
      answer: "",
      buttonText: "VER RESPUESTAS",

      //TOKEN
      token: getAuthToken(),
    };
  },
  computed: {},

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
      //this.hideAnswer = !this.hideAnswer;
      if (this.hideAnswer === false) {
        this.buttonText = "OCULTAR RESPUESTAS";
      } else {
        this.buttonText = "VER RESPUESTAS";
      }
      this.hideAnswer = !this.hideAnswer;
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
/* * {
  margin: 0;
} */
.lengthTxt {
  word-break: break-word;
}

.numberQuestions {
  color: var(--blue);
}

.hideButton {
  display: none;
}

.hideQuestion {
  display: none;
}
.questionInfo {
  text-align: left;
  background-color: var(--ligthColor);
  padding: 1rem 1.5rem;
  margin: 1rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.dataMeta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0.5rem 0;
}

.answerMeta {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}
.autorInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
}

@media only screen and (min-width: 600px) {
  .answerMeta {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
  }
}
@media only screen and (min-width: 1200px) {
  .questionContent {
    width: 75vw;
  }
}
</style>
