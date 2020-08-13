<template>
  <div>
    <div v-for="answer in answers" :key="answer.id">
      <div class="autorInfo">
        <img class="avatar" :src="getImageName(answer.avatarExpert)" />
        <p>{{ answer.expert }}</p>
      </div>
      <p>{{ answer.answer }}</p>
      <p>
        respondida: {{ getFormat(answer.respond) }} | Hace:
        {{ getDistance(answer.respond) }}
      </p>
      <div
        @mouseleave="showCurrentRating(0)"
        @click="getAnswerId(answer.id)"
        style="display:inline-block;"
      >
        <star-rating
          :rating="parseInt(answer.rating)"
          @current-rating="showCurrentRating"
          @rating-selected="setCurrentSelectedRating"
          :increment="1"
          :max-rating="5"
          inactive-color="var(--regularColor)"
          active-color="var(--principalColor)"
          :star-size="20"
        ></star-rating>
        <p>{{ answer.total_votes }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";
import starrating from "vue-star-rating";

export default {
  name: "getanswer",
  data() {
    return {
      rating: 0,
      idAnswerRate: "",
      currentSelectedRating: "",
    };
  },
  props: {
    answers: Array,
  },
  methods: {
    getAnswerId(id) {
      this.idAnswerRate = id;
    },
    showCurrentRating: function (rating) {
      this.currentRating = rating === 0 ? this.currentSelectedRating : rating;
    },
    setCurrentSelectedRating(rating) {
      this.currentSelectedRating = rating;
      let data = {
        id: this.idAnswerRate,
        rating,
      };
      this.$emit("newVote", data);
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

<style></style>
