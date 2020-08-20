<template>
  <div>
    <div class="questionInfo">
      <div class="autorInfo">
        <img class="avatar" :src="getImageName(question.avatar)" />
        <p>{{ question.name_user }}</p>
      </div>
      <h3>{{ question.title }}</h3>

      <!--METADATA FECHA-->
      <span class="dataMeta">
        <p class="accesibilityTxt">
          Formulada: {{ getFormat(question.date) }} | Hace:
          {{ getDistance(question.date) }}
        </p>
        <p
          :class="'languageStyle ' + question.name_language.toLowerCase()"
        >{{ question.name_language }}</p>
      </span>
      <!--CONTENIDO PREGUNTA-->
      <p class="lengthTxt">{{ question.question_text }}</p>

      <!--METADATA RESPUESTAS-->
      <div class="answerMeta">
        <h3>
          <small>
            RESPUESTAS
            <b class="numberQuestions">{{ question.answers }}</b>
          </small>
        </h3>
      </div>
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
  },
  methods: {
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
  background-color: var(--ligthColor);
  padding: 1.5rem;
  padding-bottom: 0;
  margin: 1.5rem 0 0 0;
  border-radius: 0.25rem;
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
</style>