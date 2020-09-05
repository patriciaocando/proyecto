<template>
  <div class="questionConteiner">
    <question :question="question"/>

    <div id="answerInput">
      <h3>Escribe tu respuesta:</h3>
      <textarea
        id="answer"
        cols="50"
        rows="10"
        minlength="25"
        required
        v-model="answer"
        placeholder="Escribe tu respuesta"
      />

      <!--BOTONES-->
      <div class="buttons">
        <button @click="publishAnswer()">RESPONDER</button>
        <button class="cancelButton" @click="cancelAction()">CANCELAR</button>
      </div>
    </div>
  </div>
</template>
    
<script>
import question from "@/components/Question.vue";
import { alertFunction } from "../utils/helpers";
import api from "@/api/api.js";

export default {
  name: "answerQuestion",
  props: {
    question: Object
  },
  components: {
    question
  },
  data() {
    return {
      answer: "",
      showError: false,
      errorMessage: ""
    };
  },
  methods: {
    cancelAction() {
      this.answer = "";
      this.$emit("cancelEdition");
    },
    async publishAnswer() {
      let data = {
        content: this.answer
      };
      try {
        const response = await api.newAnswer(this.question.id, data);

        alertFunction(
          "success",
          "HAS RESPONDIDO",
          "Tu respuesta se ha publicado correctamente"
        );
        this.$router.push({ name: "UserAnswers" });
      } catch (error) {
        this.showError = true;
        this.errorMessage = error;
      }
    }
  }
};
</script>
    
<style scoped>
.questionConteiner {
  background-color: var(--ligthColor);
  padding-bottom: 2rem;
  border-radius: 0.5rem;
}

#answerInput {
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 1rem;
  margin: 1rem;
  -webkit-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  -moz-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media only screen and (min-width: 600px) {
}

@media only screen and (min-width: 1200px) {
  .buttons {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: flex-start;
  }
}
</style>