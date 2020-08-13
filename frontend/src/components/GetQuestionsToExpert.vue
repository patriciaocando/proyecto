<template>
  <div>
    <div class="questionInfo" v-for="(question,index) in questions" :key="question.id">
      <div class="autorInfo">
        <img class="avatar" :src="getImageName(question.avatar)" />
        <p>{{ question.autor}}</p>
      </div>
      <h3>{{ question.title }}</h3>
      <span>
        <p>Formulada: {{getFormat(question.date)}} | Hace: {{getDistance(question.date)}}</p>
        <p>{{ question.name_language }}</p>
      </span>
      <p>{{ question.question_text }}</p>
      <div>
        <h4>NO HAY RESPUESTAS AUN</h4>
        <button @click="sendQuestionId(question.id)">RESPONDER</button>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "ShowQuestionsToExpert",
  components: {},
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
    getFormat(date) {
      return format(new Date(date), "dd/M/yyyy", { locale: es });
    },
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
  },
};
</script>

<style scoped>
.questionInfo {
  text-align: left;
}

.autorInfo {
  display: flex;
  flex-direction: row;
}
</style>
