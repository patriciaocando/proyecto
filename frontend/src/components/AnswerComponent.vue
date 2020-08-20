<template>
  <div>
    <div v-for="(answer, index) in answers" :key="answer.id">
      <question :question="answer" />

      <div class="answerContent">
        <div class="currentAnswer" v-show="hideAnswer">
          <p>{{ answer.answer }}</p>

          <div class="metaDataAnswr">
            <p class="accesibilityTxt">
              RESPONDIDA: {{ getFormat(answer.respond) }} | Hace:
              {{ getDistance(answer.respond) }}
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

            <button id="editButton" @click="activateEdition( index)">EDITAR</button>
          </div>
        </div>
        <!--EDITAR RESPUESTA-->
        <div v-show="!hideAnswer" v-if="selectedAnswer === index" class="answerEdit">
          <div>
            <textarea id="answer" type="text" name="textAnswer" v-model="newAnswer"></textarea>
          </div>
          <div class="buttonsContainer">
            <button id="button3" @click="deleteAnswer(answer.id)">Borrar respuesta</button>
            <div class="buttonsInsideContainer">
              <button @click="postEditedAnswer(answer.id)">GUARDAR</button>
              <button class="cancelButton" @click="cancelRequest()">CANCELAR</button>
            </div>
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
    getFormat(date) {
      return format(new Date(date), "dd/M/yyyy", { locale: es });
    },
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
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
}

#editButton {
  background-image: url("../assets/icons/EDITAR.svg");
  background-repeat: no-repeat;
  background-position: 3% 50%;
  outline: 0;
  margin: 0;
  background-color: white;
  color: var(--mediumColor);
}

#button3 {
  background-image: url("../assets/icons/BORRAR.svg");
  background-repeat: no-repeat;
  background-position: 5% 50%;
  background-size: 16px;
  margin: 0;
}

.buttonsContainer,
.buttonsInsideContainer {
  margin: 0 1rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: space-around;
  justify-content: space-around;
  align-content: stretch;
}

.currentAnswer,
.answerEdit {
  background-color: white;
  padding: 1rem;
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

#answer {
  width: 90%;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid var(--regularColor);
  font-family: "Open Sans";
  font-weight: var(--semiBold);
  font-size: 16px;
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
  #button3 {
    background-position: 3% 50%;
    flex-grow: 1;
  }
}
@media only screen and (min-width: 1200px) {
  .buttonsContainer {
    align-items: center;
    justify-content: space-between;
  }
  #button3 {
    background-position: 1% 50%;
    padding: 0 2rem;
    flex-grow: 0;
  }
}
</style>
