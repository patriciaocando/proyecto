<template>
  <div>
    <div>
      <div class="questionContent" v-for="question in questions" :key="question.id">
        <question :question="question" />

        <!--RESPUESTAS META-->
        <div class="answerMeta">
          <h3>NO HAY RESPUESTAS AUN</h3>
          <button @click="sendQuestionId(question.id)">RESPONDER</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";
import question from "@/components/Question.vue";

export default {
  name: "ShowQuestionsToExpert",
  components: {
    question,
  },
  props: {
    questions: Array,
  },
  data() {
    return {};
  },
  methods: {
    sendQuestionId(id) {
      this.$emit("getQuestion", id);
    },
  },
};
</script>

<style scoped>
.questionContent {
  background-color: var(--ligthColor);
  border-radius: 0.25rem;
  padding-bottom: 0.5rem;
}

.answerMeta {
  display: flex;
  flex-direction: column;
  align-items: space-around;
  margin: 1rem;
}

@media only screen and (min-width: 1200px) {
  .questionContent {
    max-width: 65vw;
  }

  .answerMeta {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 1.5rem;
  }
}
</style>
