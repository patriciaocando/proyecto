<template>
  <div>
    <div v-for="(answer, index) in answers" :key="answer.id">
      <img class="avatar" :src="getImageName(answer.avatar)" />
      <p>Titulo: {{ answer.title }}</p>
      <p>{{ answer.estudent }}</p>
      <div class="metaQuestion">
        <p>
          Formulada: {{ getFormat(answer.asked) }} | Hace:
          {{ getDistance(answer.asked) }}
        </p>

        <p>{{ answer.language }}</p>
      </div>
      <p>Texto pregunta: {{ answer.question }}</p>

      <div v-show="hideAnswer" class="answerContent">
        <button @click="activateEdition(answer.id, index)">Editar</button>
        <p>{{ answer.answer }}</p>
        <div class="metaAnswer">
          <p>
            RESPONDIDA: respondida: {{ getFormat(answer.respond) }} | Hace:
            {{ getDistance(answer.respond) }}
          </p>
          <div style="display:inline-block;">
            <star-rating
              :rating="parseInt(answer.rating)"
              read-only
              active-color="var(--principalColor)"
              :star-size="20"
            ></star-rating>
            <p>{{ answer.total_votes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import starrating from "vue-star-rating";
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "AnswerComponent",
  components: {
    starrating,
  },
  data() {
    return {
      hideAnswer: true,
      rating: 0,
      idAnswerRate: "",
      currentSelectedRating: "",
    };
  },
  props: {
    answers: Array,
  },
  methods: {
    getFormat(date) {
      return format(new Date(date), "dd/M/yyyy", { locale: es });
    },
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
    getImageName(name) {
      let url = process.env.VUE_APP_STATIC;
      return url + name;
    },
    getAnswerId(id) {
      this.idAnswerRate = id;
    },

    activateEdition(id, index) {
      let editedAnswerData = {
        id,
        currentAnswer: this.answers[index].answer,
      };
      this.hideAnswer = false;
      this.$emit("editedAnswer", editedAnswerData);
    },
  },
};
</script>

<style scoped>
.answerContent {
  border: 1px solid gray;
}
</style>
