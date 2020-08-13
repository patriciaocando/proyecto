<template>
  <div>
    <getquestions :questions="question" />
    <!--RESPONDER-->
    <div>
      <input type="textarea" v-model="answer" />
      <button @click="publishAnswer()">RESPONDER</button>
      <button class="cancelButton" @click="cancelAction()">CANCELAR</button>
    </div>
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
      console.log("Estoy enviando ->", data);
      this.$emit("publishAnswer", data);
    },
  },
};
</script>
    
    <style>
</style>