<template>
  <div>
    <div v-for="answer in answers" :key="answer.id">
      <div class="answrContainer">
        <div class="exepertInfo">
          <img class="avatar" :src="getImageName(answer.avatarExpert)" />
          <p>{{ answer.expert }}</p>
        </div>

        <p>{{ answer.answer }}</p>
        <div class="metaDataAnswr">
          <h4>
            {{ getFormat(answer.respond) }} | Hace:
            {{ getDistance(answer.respond) }}
          </h4>

          <div
            class="ratingStyle"
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
              active-color="var(--blue)"
              :star-size="20"
            ></star-rating>
          </div>
          <!-- <h4>({{ answer.total_votes -1 }})</h4> -->
        </div>
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

<style scoped>
.answrContainer {
  margin: 1rem 0;
  background-color: white;
  padding: 1rem;
  -webkit-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  -moz-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
}
.exepertInfo {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1rem;
}
.metaDataAnswr {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: flex-start;
  margin: 1rem 0;
}

@media only screen and (min-width: 600px) {
  .metaDataAnswr {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
  }
}
@media only screen and (min-width: 1200px) {
}
</style>
