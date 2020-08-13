<template>
  <div>
    <div
      class="questionInfo"
      v-for="(question, index) in questions"
      :key="question.id"
    >
      <!--<div class="autorInfo">
        <img class="avatar" :src="question.question.avatar" />
        <p>{{ question.question.name_user }}</p>
      </div>-->
      <h3>{{ question.question.title }}</h3>
      <button @click="sendIndex(index)">Editar</button>
      <span class="metaText">
        <p>
          Formulada: {{ getFormat(question.question.date) }} | Hace:
          {{ getDistance(question.question.date) }}
        </p>

        <p>{{ question.question.name_language }}</p>
      </span>
      <p>{{ question.question.question_text }}</p>
      <p>{{ count }}</p>
      <button v-show="seeButtonAnswer" @click="showAnswers()">
        VER RESPUESTAS
      </button>

      <!--RESPUESTAS-->
      <div
        v-show="seeAnswer"
        class="answerInfo"
        v-for="answer in answers"
        :key="answer.id"
      >
        <img class="avatar" :src="question.answer[index].avatar" />
        <p>{{ question.answer[index].expert }}</p>
        <p>{{ question.answer[index].answer }}</p>
        <p>
          Formulada: {{ getFormat(question.answer[index].date) }} | Hace:
          {{ getDistance(question.answer[index].date) }}
        </p>
        <p>
          {{ question.answer[index].rating }} ({{
            question.answer[index].total_votes - 1
          }})
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";
export default {
  name: "ShowQuestionsAnswer",
  data() {
    return {
      seeAnswer: false,
      seeButtonAnswer: "",
    };
  },
  props: {
    questions: Array,
    answers: Array,
    count: String,
  },
  methods: {
    getFormat(date) {
      return format(new Date(date), "dd/M/yyyy", { locale: es });
    },
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
    showButtonAnswer() {
      if (this.count === "0") {
        this.seeButtonAnswer = true;
      } else {
        this.seeButtonAnswer = false;
      }
    },
    showAnswers() {
      if (this.seeAnswer === false) {
        this.seeAnswer = true;
      } else {
        this.seeAnswer = false;
      }
    },
    sendIndex(index) {
      let questionData = this.questions[index].question;

      this.$emit("questionData", questionData);
    },
  },
  created() {
    this.showButtonAnswer();
  },
};
</script>

<style scoped>
.questionInfo {
  text-align: left;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.autorInfo {
  display: flex;
  flex-direction: row;
}
</style>
