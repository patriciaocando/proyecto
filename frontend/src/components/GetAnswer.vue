<template>
  <div class="answerContainer">
    <div v-for="answer in answers" :key="answer.id">
      <div class="answrContainer">
        <div class="exepertInfo">
          <img class="avatar" :src="getImageName(answer.avatarExpert)" />
          <p>{{ answer.expert }}</p>
        </div>

        <p>{{ answer.answer }}</p>
        <div class="metaDataAnswr">
          <p class="accesibilityTxt">
            {{ answer.respond | getFormat }} | Hace:
            {{ answer.respond | getDistance }}
          </p>

          <star-rating
            inactive-color="var(--regularColor)"
            active-color="var(--blue)"
            :rating="parseInt(answer.rating)"
            :increment="1"
            :max-rating="5"
            :star-size="20"
            @rating-selected="setRating"
            @current-rating="setAnswerId(answer.id)"
          ></star-rating>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import starrating from "vue-star-rating";
import api from "@/api/api";

import { alertFunction } from "../utils/helpers";

export default {
  name: "getanswer",
  props: {
    answers: Array,
  },
  data() {
    return {
      rating: 0,
      answerId: "",
    };
  },

  methods: {
    setAnswerId(id) {
      this.answerId = id;
    },
    async setRating(rating) {
      this.rating = rating;

      try {
        let data = {
          id: this.answerId,
          rating: this.rating,
        };
        const response = await api.postRating(data);

        this.$emit("newVote", data);
      } catch (error) {
        console.log(error);
        alertFunction("error", "Opss!", `Ya has votado esta respuesta`);
      }
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
  },
};
</script>

<style scoped>
.answrContainer {
  text-align: left;
  margin: 2rem;
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
