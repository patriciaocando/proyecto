<template>
  <div>
    <div
      class="answerContent"
      v-for="(answer, index) in answers"
      :key="answer.id"
    >
      <question :question="answer" />

      <div class="currentAnswer" v-show="hideAnswer">
        <span>
          <button id="editButton" @click="activateEdition(index)">
            EDITAR
          </button>
        </span>

        <p>{{ answer.answer }}</p>

        <div class="metaDataAnswr">
          <p class="accesibilityTxt">
            RESPONDIDA: {{ answer.respond | getFormat }} | Hace:
            {{ answer.respond | getDistance }}
          </p>
        </div>

        <div class="ratingStyle">
          <div style="display:inline-block;">
            <star-rating
              :rating="parseInt(answer.rating)"
              read-only
              active-color="var(--blue)"
              :star-size="20"
            ></star-rating>
          </div>
        </div>
      </div>

      <!--EDITAR RESPUESTA-->
      <div
        v-show="!hideAnswer"
        v-if="selectedAnswer === index"
        class="answerEdit"
      >
        <div>
          <textarea
            type="text"
            name="textAnswer"
            v-model="newAnswer"
          ></textarea>
        </div>
        <div class="buttonsContainer">
          <button class="deleteButton" @click="deleteAnswer(answer.id)">
            Borrar respuesta
          </button>
          <div class="buttonsInsideContainer">
            <button @click="postEditedAnswer(answer.id)">GUARDAR</button>
            <button class="cancelButton" @click="cancelRequest()">
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import starrating from "vue-star-rating";
import question from "@/components/Question.vue";

export default {
  name: "AnswerComponent",
  components: {
    starrating,
    question,
  },
  data() {
    return {
      hideAnswer: true,
      rating: 0,
      idAnswerRate: "",
      currentSelectedRating: "",
      //Variable de componente
      editAnswer: true,
      selectedAnswer: "",
      //Variable nueva respuesta
      newAnswer: "",
    };
  },
  props: {
    answers: Array,
  },
  methods: {
    activateEdition(index) {
      this.selectedAnswer = index;
      this.editAnswer = true;
      this.hideAnswer = false;
      this.newAnswer = this.answers[index].answer;
    },
    postEditedAnswer(id) {
      let editedAnswerData = {
        id,
        currentAnswer: this.newAnswer,
      };
      console.log(editedAnswerData);
      this.$emit("editedAnswer", editedAnswerData);
    },

    deleteAnswer(id) {
      this.$emit("deleteAnswer", id);
    },

    cancelRequest() {
      this.editAnswer = false;
      this.hideAnswer = true;
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
