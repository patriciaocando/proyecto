<template>
  <div>
    <vue-headful
      title="Nuestros Expertos | TutorShip"
      description="Detalle de cada uno de nuestros expertos"
    />
    <h1 class="title">Conoce a nuestros expertos</h1>
    <p v-show="showError">{{ errorMessage }}</p>

    <ul class="allExpContainer">
      <li class="expertContainer" v-for="expert in experts" :key="expert.id">
        <!-- {{expert}} -->
        <div class="autorInfo">
          <img class="expertAvatar" :src="getImageName(expert.expert.avatar)" />
          <span>
            <h3>{{ expert.expert.username }}</h3>
            <p class="accesibilityTxt">
              Experto desde: {{ expert.expert.creation_date | getDistance }}
            </p>
          </span>
        </div>

        <div class="bioContainer">
          <h3>BIO:</h3>
          <p>{{ expert.expert.profile_bio }}</p>
        </div>

        <div>
          <h3>Lenguajes:</h3>
          <div class="languagesContainer">
            <div
              class="languageName"
              v-for="language in expert.language"
              :key="language.id"
            >
              <img class="languageImage" :src="getImageName(language.image)" />
              <p class="accesibilityTxt">{{ language.language }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "@/api/api";

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
    getImageName(name) {
      return process.env.VUE_APP_STATIC + name;
    },
    //TRAIGO TODAS LOS EXPETOS DESDE LA API
    async getExperts() {
      try {
        this.experts = await api.getAllExperts();
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getExperts();
  },
};
</script>

<style scoped>
.title {
  margin-bottom: 2rem;
}
h3 {
  margin-bottom: 0;
}
.allExpContainer {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  padding: 0;
}
.expertContainer {
  border-radius: 0.5rem;
  list-style: none;
  background-color: var(--regularColor);
  padding: 1rem;
  width: 90%;
  margin-bottom: 1.5rem;
}
.autorInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 1rem;
}
.expertAvatar {
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin: 1.5rem;
}
.bioContainer {
  margin: 1.5rem 0;
}
.languageImage {
  width: 48px;
  height: 48px;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.languagesContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  align-content: center;
  width: 100%;
  margin: 1rem auto;
}
.languageName {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (min-width: 500px) {
  .allExpContainer {
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: 1rem;
  }
  .container {
    list-style: none;
    display: flex;
    flex-direction: row;
  }
  .expertContainer {
    width: 40%;
    height: 300px;
  }
  .languageImage {
    width: 56px;
    height: 56px;
    border-radius: 0.25rem;
    margin-right: 1rem;
  }
  .autorInfo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
  .expertAvatar {
    width: 80px;
    height: 80px;
    margin: 1rem 1rem 0 0;
  }
  .languagesContainer {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

@media only screen and (min-width: 900px) {
  .allExpContainer {
    max-width: 70vw;
    margin: 0 auto;
  }
  .expertContainer {
    height: 30%;
    padding: 1.5rem;
  }
}
</style>
