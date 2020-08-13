<template>
  <div>
    <!--MENUS-->
    <div v-if="role === 'experto'">
      <menuexpert />
    </div>

    <div v-if="role === 'estudiante'">
      <menustudent />
    </div>

    <!--ELEMENTOS COMUNES-->
    <div>
      <h4>¡HOLA!</h4>
      <p>{{username}}</p>
      <!--COMPONENTE DE BUSQUEDA-->
      <searchcomponent v-on:queryParams="collectParams" :languages="languages" />
      <!--NUEVA PREGUNTA-->
      <button>
        <router-link :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
      </button>
      <!--GESTION DE ERRORES-->
      <p v-show="showError">{{ errorMessage }}</p>
      <!--MOSTRAR LOS RESULTADOS DE LA BUSQUEDA-->
      <div v-show="showResultSearch">
        <getquestions :questions="questionsResultSearch" />
      </div>
    </div>

    <!--VISTA EXPERTO-->
    <div v-if="role === 'experto'">
      <h3>EXPERTO</h3>
      <showquestionstoexpert
        v-show="allQuestions"
        :questions="questionsToExpert"
        v-on:getQuestion="getQuestion"
      />
      <answerquestion
        v-show="!allQuestions"
        :question="question"
        v-on:publishAnswer="publishAnswer"
        v-on:cancelEdition="cancelEdition"
      />
    </div>

    <!--VISTA ADMIN-->

    <!--VISTA ESTUDIANTE-->
    <div v-show="role === 'estudiante'">
      <div>
        <h3>ACTIVIDAD RECIENTE</h3>
        <ShowQuestionsAnswer
          :questions="studentQuestions"
          :answer="studentAnswers"
          :count="count"
          v-on:questionData="getQuestionData"
          v-show="showQuestion"
        />
        <div v-show="noQuestions">
          <p>¡Haz tu primera pregunta!</p>
        </div>
      </div>
      <!--EDITAR PREGUNTA-->
      <div v-show="hideQuestion">
        <h2>EDITAR PREGUNTA:</h2>
        <h3>TITULO:</h3>
        <input type="text" :placeholder="title" v-model="title" />
        <textarea type="text" name="textQuestion" rows="4" :placeholder="content" v-model="content"></textarea>
        <p v-show="showError">{{ errorMessage }}</p>
        <button @click="deleteQuestion()">Borrar pregunta</button>
        <div>
          <button @click="saveEdition()">GUARDAR</button>
          <button class="cancelButton" @click="cancelEdition()">CANCELAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//COMPONENTES DE MENUS
import menuexpert from "@/components/MenuExpert.vue";
import menustudent from "@/components/MenuStudent";
//COMPONENTES DE BUSQUEDA
import searchcomponent from "@/components/SearchComponent.vue";
import getquestions from "@/components/GetQuestions.vue";
//COMPONENTES PARA EXPERTO
import answerquestion from "@/components/AnswerQuestion.vue";
import showquestionstoexpert from "@/components/GetQuestionsToExpert.vue";
import ShowQuestionsAnswer from "@/components/GetQuestionAnswer.vue";

//IMPORTAR UTILIDADES
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import es from "date-fns/locale/es";
import axios from "axios";
import {
  getAuthToken,
  getRoleToken,
  getIdToken,
  alertFunction,
  config,
  ENDPOINT,
} from "../utils/helpers";

export default {
  name: "HomeExpert",
  components: {
    menuexpert,
    menustudent,
    getquestions,
    searchcomponent,
    showquestionstoexpert,
    answerquestion,
    ShowQuestionsAnswer,
  },
  data() {
    return {
      //visualizaciond de dashboard
      role: "",
      idUserLoged: "",
      username: "",
      avatar: "",
      //Variable para interpolar los lenguages en la busqueda
      languages: [],
      //Variable estudiante
      studentQuestions: [],
      studentAnswers: [],
      hideQuestion: false,
      showQuestion: true,
      noQuestions: false,
      count: "",

      //Variables de componente
      title: "",
      content: "",
      idQuestion: "",

      question: [],
      questionsToExpert: [],
      allQuestions: true,
      //Variables resultado de la busqueda
      showResultSearch: false,
      questionsResultSearch: [],

      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      //TOKEN
      token: getAuthToken(),
    };
  },
  methods: {
    //////////////////////////////////////////////////////
    //ENPOINTS GENERALES
    //OBTENGO EL ROL PARA SABER QU LE VA A MOSTRAR AL USUARIO SEGUN SU ROL
    async getRole(token) {
      console.log(this.token);
      /* this.token = getAuthToken(); */
      this.role = await getRoleToken(this.token);
      this.idUserLoged = await getIdToken(this.token);
      await this.getUserProfile();
      //this.role = "experto";
      if (this.role === "estudiante") {
        await this.getStudentQuestions();
      } else if (this.role === "experto") {
        await this.getQuestionsToAnswer();
      } else {
        console.log("carga funcion de admin");
      }
    },
    //TRAIGO LA INFO DEL PERFIL DE USUARIO DE LA BBDD
    async getUserProfile() {
      try {
        this.userId = getIdToken(this.token);
        const response = await axios.get(
          ENDPOINT + "/users/profile/" + this.idUserLoged,
          config
        );

        this.username = response.data.data.username;
        this.avatar = process.env.VUE_APP_STATIC + response.data.data.avatar;
        console.log(this.avatar);
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //RECIBO LOS PARAMETROS DE BUSQUEDA DESDE MI COMPONENTE
    async collectParams(componentParams) {
      this.successSearch = true;
      this.showError = false;
      this.queryParams = componentParams;
      this.showQuestion = false;
      await this.getQuestions();
    },
    //TRAER LOS LENGUAGES DE LA BBDD PARA EL SELECTOR DE LA BUSQUEDA AVANZADA
    async getLanguages() {
      try {
        const response = await axios.get(ENDPOINT + "/languages");
        this.languages = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    /* cancelEdition() {
      this.allQuestions = true;
    }, */
    //////////////////////////////////////////////////////
    //ENPOINTS PARA ESTUDIANTE
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD PARA HACER LA CONSULTA DE LA BUSQUEDA
    async getQuestions() {
      try {
        const response = await axios.get(ENDPOINT + "/questions", {
          params: this.queryParams,
        });
        this.questionsResultSearch = response.data.data;
        this.showResultSearch = true;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;

        if (
          this.errorMessage === "No hay preguntas que coincidan con tu busqueda"
        ) {
          this.showResultSearch = false;
        }
      }
    },
    //DESDE LA BBDD
    async getStudentQuestions() {
      try {
        const response = await axios.get(ENDPOINT + "/my-questions/", config);

        let resultNumber = response.data.resultAnswers;
        if (resultNumber.length === 0) {
          this.noQuestions = true;
        } else {
          this.studentQuestions = response.data.resultAnswers;
        }
        if (response.data.resultAnswers[0].answer.length === 0) {
          this.count = "NO HAY RESPUESTAS AÚN";
        } else {
          this.count = response.data.resultAnswers[0].answer.length;
          this.studentAnswers = response.data.resultAnswers[0].answer;
        }
      } catch (error) {
        this.showError = true;
        console.log(error);
        this.errorMessage = error.response.data.message;
      }
    },
    //DESDE EL COMPONENTE
    getQuestionData(questionData) {
      this.hideQuestion = true;
      this.showQuestion = false;
      this.title = questionData.title;
      this.content = questionData.question_text;
      this.idQuestion = questionData.id;
    },
    //DESDE LA VISTA
    cancelEdition() {
      this.title = "";
      this.content = "";
      this.hideQuestion = false;
      this.showQuestion = true;
    },
    async saveEdition() {
      //DATA
      let data = {
        title: this.title,
        content: this.content,
      };

      try {
        const response = await axios.put(
          ENDPOINT + "/edit-question/" + this.idQuestion,
          data,
          config
        );
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }

      //ALERT DE EDITAR
      alertFunction(
        "success",
        "Actualizado",
        `Has editado tu pregunta exitosamente`
      );
      setTimeout(function () {
        location.reload();
      }, 1000);
    },
    async deleteQuestion() {
      try {
        const response = await axios.delete(
          ENDPOINT + "/delete-question/" + this.idQuestion,
          config
        );
        alertFunction("Borrada!", "Tu pregunta ha sido borrada.", "success");
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    //////////////////////////////////////////////////////
    //ENPOINTS PARA EXPERTO
    //TRAIGO LAS PREGUNTAS QUE PUEDE RESPONDER EL EXPERTO
    async getQuestionsToAnswer() {
      try {
        const response = await axios.get(
          ENDPOINT + "/questions/to-answer",
          config
        );
        this.questionsToExpert = response.data.data;
      } catch (error) {
        console.log(error);
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async getQuestion(id) {
      try {
        const response = await axios.get(ENDPOINT + "/question/" + id, config);
        this.question.push(response.data.data);
        this.allQuestions = false;
        this.idQuestion = id;
      } catch (error) {
        console.log(error);
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
    async publishAnswer(data) {
      try {
        const response = await axios.post(
          ENDPOINT + "/new-answer/" + this.idQuestion,
          data,
          config
        );
        alertFunction(
          "success",
          "HAS RESPONDIDO",
          "Tu respuesta se ha publicado correctamente"
        );
        this.$router.push("/UserAnswer");
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    getAuthToken();
    this.getRole();
    this.getLanguages();
  },
};
</script>

<style scoped></style>
