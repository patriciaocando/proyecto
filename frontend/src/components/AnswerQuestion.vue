<template>
  <div>
    <div class="questionConteiner">
      <getquestions :questions="question" />
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
    <!--RESPONDER-->
  </div>
</template>
    
<script>
import getquestions from "@/components/GetQuestions.vue";

export default {
  name: "answerQuestion",
  props: {
    question: Array,
  },
  components: {
    getquestions,
  },
  data() {
    return {
      answer: "",
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    cancelAction() {
      this.answer = "";
      this.$emit("cancelEdition");
    },
    publishAnswer() {
      let data = {
        content: this.answer,
      };
      /* console.log("Estoy enviando ->", data); */
      this.$emit("publishAnswer", data);
    },
  },
};
</script>
    
<style scoped>
.questionConteiner {
  background-color: var(--ligthColor);
  width: 50vh;
  padding-bottom: 2rem;
  border-radius: 0.25rem;
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
  .questionConteiner {
    width: 100%;
  }
}

@media only screen and (min-width: 1200px) {
  .questionConteiner {
    width: 65vw;
  }
  .buttons {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    justify-content: flex-start;
  }
  /* #answer {
    max-width: 100%;
  } */
}
</style>