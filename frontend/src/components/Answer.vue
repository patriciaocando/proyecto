<template>
  <div>
    <div class="answerContent" v-for="(answer, index) in answers" :key="answer.id">
      <question :question="answer" :route="route" />

      <div class="currentAnswer" v-show="!editAnswer">
        <span>
          <button id="editButton" @click="activateEdition(index)">EDITAR</button>
        </span>

        <p>{{ answer.answer }}</p>

        <div class="metaDataAnswr">
          <p class="accesibilityTxt">
            RESPONDIDA: {{ answer.respond | getFormat }} | Hace:
            {{ answer.respond | getDistance }}
          </p>
        </div>

        <div class="ratingStyle">
          <div style="display:inline-block;" @click="alertRating">
            <star-rating
              read-only
              active-color="var(--blue)"
              :rating="parseInt(answer.rating)"
              :star-size="20"
            ></star-rating>
          </div>
        </div>
      </div>

      <!--EDITAR RESPUESTA-->
      <div v-show="editAnswer" v-if="selectedAnswer === index" class="answerEdit">
        <div>
          <textarea type="text" name="textAnswer" v-model="newAnswer"></textarea>
        </div>
        <div class="buttonsContainer">
          <button class="deleteButton" @click="deleteAnswer(answer.id)">Borrar respuesta</button>
          <div class="buttonsInsideContainer">
            <button @click="postEditedAnswer(answer.id)">GUARDAR</button>
            <button class="cancelButton" @click="cancelRequest()">CANCELAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import starrating from "vue-star-rating";
import question from "@/components/Question.vue";
import { alertFunction } from "../utils/helpers";

export default {
  name: "answer",
  components: {
    starrating,
    question,
  },
  data() {
    return {
      rating: 0,
      idAnswerRate: "",
      currentSelectedRating: "",
      //Variable de componente
      editAnswer: false,
      selectedAnswer: "",
      //Variable nueva respuesta
      newAnswer: "",
    };
  },
  props: {
    answers: Array,
    endEdition: Boolean,
  },
  computed: {
    route() {
      return this.$route.name;
    },
  },
  methods: {
    alertRating() {
      alertFunction(
        "warning",
        "Upss!",
        "No puedes votar tus propias respuestas"
      );
    },

    activateEdition(index) {
      this.selectedAnswer = index;
      this.editAnswer = true;
      this.newAnswer = this.answers[index].answer;
    },
    postEditedAnswer(id) {
      let editedAnswerData = {
        id,
        currentAnswer: this.newAnswer,
      };
      this.$emit("editedAnswer", editedAnswerData);
      this.editAnswer = false;
    },

    deleteAnswer(id) {
      this.$emit("deleteAnswer", id);
    },

    cancelRequest() {
      this.editAnswer = false;
    },
  },
};
</script>

<style scoped>
.answerContent {
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: var(--ligthColor);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
}

.currentAnswer,
.answerEdit {
  background-color: white;
  padding: 2rem;
  margin: 1rem;
  -webkit-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  -moz-box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
  box-shadow: 0px 13px 14px -13px rgba(173, 173, 173, 0.64);
}

.metaDataAnswr {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: flex-start;
  margin: 1rem 0;
}

.ratingStyle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  .buttonsInsideContainer {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .buttonsContainer {
    margin: 0;
    flex-direction: row;
    align-items: center;
  }
  .deleteButton {
    background-position: 3% 50%;
    flex-grow: 1;
  }
}
@media only screen and (min-width: 1200px) {
  .buttonsContainer {
    align-items: center;
    justify-content: space-between;
  }
  .deleteButton {
    background-position: 1% 50%;
    padding: 2rem;
    flex-grow: 0;
  }
}
</style>
