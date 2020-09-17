<template>
  <div>
    <div class="questionInfo" v-if="!isEdited">
      <div class="autorInfo">
        <span class="autorInfo">
          <img class="avatar" :src="getImageName(question.avatar)" />
          <p>{{ question.name_user }}</p>
        </span>
        <div v-if="route === 'UserQuestions'">
          <!--  <button id="editButton" @click="$emit('editquestion', question.id)">Editar pregunta</button> -->
          <button id="editButton" @click="editquestion()">Editar pregunta</button>
        </div>
      </div>
      <h3>{{ question.title }}</h3>

      <!--METADATA FECHA-->
      <span class="dataMeta">
        <p class="accesibilityTxt">
          Formulada: {{ question.date | getFormat }} | Hace:
          {{ question.date | getDistance }}
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
          RESPUESTAS
          <b class="numberQuestions">{{ question.answers }}</b>
        </h3>

        <!--OPCION SI ES EXPERTO Y SI NO HAY RESPUESTAS MOSTRARSE-->
        <span class="answer" v-if="isExpert && route ==='Dashboard' && question.answers === 0">
          <h3>NO HAY RESPUESTAS AUN</h3>
          <button @click="getIdQuestionToAnswer(question.id)">RESPONDER</button>
        </span>

        <!--MOSTRAR LAS RESPUESTAS SI ES USUARIO-->
        <button
          v-show="isUser"
          v-if="route !== 'UserAnswers' && question.answers >0 "
          :class="{ hideButton: question.answers < 0 }"
          @click="sendQuestionId(question.id)"
        >{{ buttonText }}</button>
      </div>
    </div>
    <!--EDITAR PREGUNTA-->
    <div class="questionEdit" v-if="isEdited">
      <h3>TITULO:</h3>
      <input class="titleInput" type="text" :placeholder="title" v-model="title" />
      <textarea type="text" name="textQuestion" rows="4" :placeholder="content" v-model="content"></textarea>

      <div class="buttonsContainer">
        <button class="deleteButton" @click="questionDeleted(question.id)">Borrar pregunta</button>
        <div class="buttonsInsideContainer">
          <button @click="saveEdition(question.id)">GUARDAR</button>
          <button class="cancelButton" @click="cancelEdition()">CANCELAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userData from "@/dataStorage/userData";
import api from "@/api/api.js";

export default {
  name: "Question",
  props: {
    question: Object,
    route: String,
    index: Number,
  },
  data() {
    return {
      //store del usuario
      sharedStore: userData.state,
      buttonText: "VER RESPUESTAS",

      //Variables de la pregunta que se debe editar
      title: "",
      content: "",
      idQuestion: "",

      isEdited: false,
    };
  },
  computed: {
    isUser() {
      return this.sharedStore.isLogged;
    },
    isExpert() {
      return this.sharedStore.role === "experto";
    },
  },
  methods: {
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    sendQuestionId(id) {
      let data = {
        id,
        index: this.index,
      };

      if (this.buttonText === "OCULTAR RESPUESTAS") {
        this.buttonText = "VER RESPUESTAS";
      } else {
        this.buttonText = "OCULTAR RESPUESTAS";
      }

      this.$emit("showmethsanswer", data);
    },
    editquestion() {
      this.isEdited = true;
      this.title = this.question.title;
      this.content = this.question.question_text;
    },
    cancelEdition() {
      this.title = "";
      this.content = "";
      this.isEdited = false;
    },
    async saveEdition(idQuestion) {
      try {
        //DATA
        let data = {
          title: this.title,
          content: this.content,
        };
        const response = await api.editQuestion(idQuestion, data);
        this.isEdited = false;
        this.$emit("questionEdited");
      } catch (error) {
        console.log(error);
      }
    },
    async questionDeleted(idQuestion) {
      try {
        const response = await api.deleteQuestion(idQuestion);
        this.$emit("questionDeleted");
        this.hideQuestion = false;
      } catch (error) {
        console.log(error);
      }
    },
    getIdQuestionToAnswer(idQuestion) {
      console.log("desdeQuestion", idQuestion);
      this.$emit("getQuestionToAnswer", idQuestion);
    },
  },
};
</script>

<style scoped>
.hideButton {
  display: none;
}

.questionEdit {
  padding: 2rem 0 2rem 2rem;
}

.questionInfo {
  text-align: left;
  background-color: var(--ligthColor);
  padding: 2rem 2rem 0 2rem;
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
  margin: 0 0 2rem 0;
}

.dataMeta .accesibilityTxt {
  margin: 0;
}

.autorInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-content: flex-start;
  margin-bottom: 1rem;
}

.answerMeta {
  margin: 2rem 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

@media only screen and (min-width: 600px) {
  .dataMeta {
    flex-direction: row;
    align-items: center;
  }
  .buttonsInsideContainer {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
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
  .answer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .answerMeta h3 {
    margin-bottom: 0;
  }
}

@media only screen and (min-width: 1200px) {
  .buttonsContainer {
    align-items: center;
    justify-content: space-between;
    width: 95%;
  }
  .deleteButton {
    background-position: 1% 50%;
    padding: 2rem;
    flex-grow: 0;
  }
  .editButton {
    flex-grow: 1;
  }
}
</style>
