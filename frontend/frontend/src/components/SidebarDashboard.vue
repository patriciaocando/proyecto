<template>
  <div>
    <div id="nav">
      <!--SIDEBAR  EXPERTO-->
      <div class="sidebar" v-if="role === 'experto'">
        <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
        <router-link :to="{ name: 'UserQuestions' }">Mis preguntas</router-link>
        <router-link :to="{ name: 'UserAnswers' }">Mis respuestas</router-link>
        <router-link :to="{ name: 'ExpertLanguages' }"
          >Mis Lenguajes</router-link
        >
        <router-link :to="{ name: 'Profile' }">Mi Perfil</router-link>
      </div>

      <!--SIDEBAR  ESTUDIANTE-->
      <div class="sidebar" v-if="role === 'estudiante'">
        <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
        <router-link :to="{ name: 'UserQuestions' }">Mis preguntas</router-link>
        <router-link :to="{ name: 'Profile' }">Mi Perfil</router-link>
      </div>

      <div class="actions">
        <router-link class="button" :to="{ name: 'NewQuestion' }"
          >Hacer pregunta</router-link
        >
        <router-link
          v-if="role === 'estudiante'"
          class="becomeExpert"
          :to="{ name: 'BecomeExpert' }"
          >SER EXPERTO</router-link
        >
        <button class="cancelButton" @click="$emit('logout')">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  logout,
  getAuthToken,
  getIdToken,
  getRoleToken,
  ENDPOINT,
  config,
} from "../utils/helpers";

export default {
  name: "SidebarDashboard",
  props: {
    username: String,
  },
  data() {
    return {
      role: "",
    };
  },
  methods: {
    getRole(token) {
      this.role = getRoleToken(token);
    },
  },
  created() {
    this.token = getAuthToken();

    this.getRole(this.token);
  },
};
</script>

<style scoped>
#nav {
  width: 296px;
  height: 88vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: var(--ligthColor);
}
#nav .sidebar a {
  color: var(--darkColor);
  text-decoration: none;
  padding: 1.5rem;
}

.cancelButton {
  background-color: transparent;
}

#nav .actions a.becomeExpert {
  background-color: none;
  text-decoration: none;
  color: var(--darkColor);
  margin: 1rem;
  padding: 1rem 1rem 1rem 1.8rem;
  background-image: url("../assets/icons/experto.svg");
  background-repeat: no-repeat;
  background-position: 1% 50%;
  outline: 0;
  margin: 0;
}

#nav .sidebar {
  text-align: left;
  width: 296px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;

  /*  padding: 1.5rem; */
}

#nav .sidebar a.router-link-exact-active {
  color: var(--blue);
  background-color: var(--ligthBlue);
  max-width: 100%;
  /* padding: 1.5rem; */
  /*color: var(--darkColor); */
  text-decoration: none;
}

.actions {
  border-top: 1px solid var(--regularColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: center;
  margin: 1rem;
}

@media only screen and (min-width: 600px) {
  /*   #nav .sidebar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  } */
}
@media only screen and (min-width: 1200px) {
  /*  #nav .sidebar {
    color: var(--blue);
    max-width: 100%;
  } */
}
</style>
