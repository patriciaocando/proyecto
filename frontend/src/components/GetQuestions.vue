<template>
  <div>
    <div class="questionContent">
      <div class="questionInfo" v-for="(question, index) in questions" :key="question.id">
        <question :question="question" />
        <span class="answerMeta">
          <button
            id="buttonAnswer"
            v-show="isUser"
            :class="{ hideButton: question.answers <= 0 }"
            @click="sendQuestionId(question.id, index)"
          >{{buttonText}}</button>
        </span>
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

import question from "@/components/Question.vue";
import getanswer from "@/components/GetAnswer.vue";

export default {
  name: "ShowQuestions",
  components: {
    getanswer,
    question,
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

.questionContent {
  margin: 1rem;
}

.hideQuestion {
  display: none;
}
.questionInfo {
  text-align: left;
  background-color: var(--ligthColor);

  margin: 1rem 0;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.answerMeta {
  display: flex;
  flex-direction: column;
  align-items: space-around;
  margin: 0 0 1.5rem 0;
}

#buttonAnswer {
  margin: 0 1.5rem;
}

@media only screen and (min-width: 600px) {
  .answerMeta {
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
}
@media only screen and (min-width: 1200px) {
  .questionContent {
    max-width: 75vw;
  }
}
</style>
