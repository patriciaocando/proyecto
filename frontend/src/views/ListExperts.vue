<template>
  <div>
    <h1>Bienvenidos a TutorShips</h1>
    <p v-show="showError">{{ errorMessage }}</p>

    <ul>
      <li v-for="expert in experts" :key="expert.id">
        <!-- {{expert}} -->
        <img class="avatar" :src="getImageName(expert.expert.avatar)" />
        <h3>USERANAME:</h3>
        <p>{{ expert.expert.username }}</p>
        <h3>LENGUAGEs:</h3>
        <div v-for="language in expert.language" :key="language.id">
          <p>{{ language.language }}</p>
          <img class="avatar" :src="getImageName(language.image)" />
        </div>

        <h3>BIO:</h3>
        <p>{{ expert.expert.profile_bio }}</p>
        <p>Experto desde: {{ getDistance(expert.expert.creation_date) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

import { config, ENDPOINT } from "../utils/helpers";

export default {
  name: "Experts",

  data() {
    return {
      experts: [],
      showError: false,
      errorMessage: "",
    };
  },

  methods: {
    getDistance(date) {
      return formatDistance(new Date(date), new Date(), { locale: es });
    },
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    //TRAIGO TODAS LAS PREGUNTAS DE LA BBDD
    async getExperts() {
      try {
        const response = await axios.get(ENDPOINT + "/experts");

        this.experts = response.data.data;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response.data.message;
      }
    },
  },
  created() {
    this.getExperts();
  },
};
</script>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}
</style>
