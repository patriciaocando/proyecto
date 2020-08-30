<template>
  <div class="questionInfo">
    <div class="autorInfo">
      <img class="avatar" :src="getImageName(question.avatar)" />
      <p>{{ question.name_user }}</p>
      <div v-if="route === 'UserQuestions'">
        <button id="editButton" @click="$emit('editquestion', question.id)">
          Editar pregunta
        </button>
      </div>
    </div>
    <h3>{{ question.title }}</h3>

    <!--METADATA FECHA-->
    <span class="dataMeta">
      <p class="accesibilityTxt">
        Formulada: {{ question.date | getFormat }} | Hace:
        {{ question.date | getDistance }}
      </p>
      <p :class="'languageStyle ' + question.name_language.toLowerCase()">
        {{ question.name_language }}
      </p>
    </span>
    <!--CONTENIDO PREGUNTA-->
    <p class="lengthTxt">{{ question.question_text }}</p>

    <!--METADATA RESPUESTAS-->
    <div class="answerMeta">
      <h3>
        RESPUESTAS
        <b class="numberQuestions">{{ question.answers }}</b>
      </h3>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "Question",
  props: {
    question: Object,
    route: String,
  },
  methods: {
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
  },
};
</script>

<style scoped>
.questionInfo {
  text-align: left;
  background-color: var(--ligthColor);
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}

.lengthTxt {
  word-break: break-word;
}

.numberQuestions {
  color: var(--blue);
}

.dataMeta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0.5rem 0;
}

.autorInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
}

.answerMeta h3 {
  margin: 2rem 0 0;
}
@media only screen and (min-width: 600px) {
  .dataMeta {
    flex-direction: row;
    align-items: center;
  }
}

@media only screen and (min-width: 1200px) {
  .autorInfo {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .autorInfo p {
    flex-grow: 1;
    margin-left: 0.5rem;
  }
}
</style>
