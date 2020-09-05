<template>
  <div>
    <div class="questionAnswerContainer" v-for="(question, index) in questions" :key="question.id">
      <question
        :question="question"
        :route="route"
        :index="index"
        @editquestion="editQuestionId"
        @showmethsanswer="showmethsanswer"
        @questionDeleted="questionDeleted"
        @questionEdited="questionEdited"
        @getQuestionToAnswer="getQuestionToAnswer"
      />
      <button
        v-if="!isUser"
        :class="{ hideButton: question.answers <= 0 }"
        @click="$router.push({ name: 'Register' })"
      >Regístrate para ver las respuestas</button>

      <getanswer
        class="answerContent"
        v-show="hideAnswer"
        v-if="index === indexAnswer"
        :answers="answers"
        @newVote="newVote"
      />
    </div>
  </div>
</template>

<script>
import question from "@/components/Question.vue";
import getanswer from "@/components/GetAnswer.vue";
import { alertFunction } from "../utils/helpers";

import userData from "@/dataStorage/userData";

import api from "@/api/api.js";

export default {
  name: "GetQuestions",
  components: {
    getanswer,
    question,
  },
  props: {
    questions: Array,
    //answers: Array
  },
  data() {
    return {
      seeAnswersButton: false,
      hideAnswer: false,

      //Variable para saber el indice de la pregunta de la que se desea ver la respuesta
      indexAnswer: "",
      buttonText: "VER RESPUESTAS",
      answers: [],
      //store del usuario
      sharedStore: userData.state,
    };
  },
  computed: {
    route() {
      return this.$route.name;
    },
    isUser() {
      return this.sharedStore.isLogged;
    },
  },

  methods: {
    getQuestionToAnswer(idQuestion) {
      console.log("desde GetQuestion", idQuestion);
      this.$emit("getQuestionToAnswer", idQuestion);
    },
    questionEdited() {
      this.$emit("questionEdited");
    },
    questionDeleted() {
      this.$emit("questionDeleted");
    },
    newVote(data) {
      alertFunction(
        "success",
        "Ranking",
        `¡Has Votado con ${data.rating} puntos!`
      );
    },
    editQuestionId(id) {
      this.$emit("editquestion", id);
    },
    async showmethsanswer({ id, index }) {
      try {
        this.indexAnswer = index;
        this.hideAnswer = !this.hideAnswer;
        this.answers = await api.getAnswers(id);
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style scoped>
.questionAnswerContainer {
  background-color: var(--ligthColor);
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-radius: 0.5rem;
}

.hideButton {
  display: none;
}

.hideQuestion {
  display: none;
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
  .answerMeta {
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 2rem;
  }
}
</style>
