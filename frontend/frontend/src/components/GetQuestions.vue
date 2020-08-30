<template>
  <div>
    <div
      class="questionAnswerContainer"
      v-for="(question, index) in questions"
      :key="question.id"
    >
      <question
        :question="question"
        :route="route"
        :isUser="isUser"
        @editquestion="editQuestionId"
      />
      <button
        v-if="!isUser"
        :class="{ hideButton: question.answers <= 0 }"
        @click="$router.push({ name: 'Register' })"
      >
        Regístrate para ver las respuestas
      </button>

      <span class="answerMeta" v-show="isUser">
        <button
          id="buttonAnswer"
          :class="{ hideButton: question.answers <= 0 }"
          @click="sendQuestionId(question.id, index)"
        >
          {{ buttonText }}
        </button>
      </span>

      <!--MOSTRAR LAS RESPUESTAS-->

      <getanswer
        v-show="hideAnswer"
        class="answerContent"
        v-if="index === answer"
        :answers="answers"
        @newVote="getRating"
      />
    </div>
  </div>
</template>

<script>
import question from "@/components/Question.vue";
import getanswer from "@/components/GetAnswer.vue";
import userData from "@/dataStorage/userData";

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

      seeAnswersButton: false,
      hideAnswer: false,

      //Variable para saber el indice de la pregunta de la que se desea ver la respuesta
      answer: "",
      buttonText: "VER RESPUESTAS",

      //store del usuario
      sharedStore: userData.state,
    };
  },
  computed: {
    isUser() {
      return this.sharedStore.isLogged;
    },
    route() {
      return this.$route.name;
    },
  },

  methods: {
    getRating(data) {
      this.$emit("rateAnswer", data);
    },
    editQuestionId(id) {
      this.$emit("editquestion", id);
    },
    closeAnswer() {},
    sendQuestionId(id, index) {
      /*  this.hideAnswer = !this.hideAnswer; */
      this.answer = index;
      /*  if (this.hideAnswer === false) {
        this.buttonText = "OCULTAR RESPUESTAS";
      } else {
        this.buttonText = "VER RESPUESTAS";
      } */
      this.hideAnswer = !this.hideAnswer;

      this.$emit("showAnswers", id);
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
