<template>
  <div>
    <div id="nav">
      <div class="links">
        <h3>¡HOLA!</h3>
        <h4>{{username}}</h4>
        <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
        <router-link :to="{ name: 'UserQuestions' }">Mis preguntas</router-link>
        <router-link :to="{ name: 'UserAnswers' }">Mis respuestas</router-link>
        <router-link :to="{ name: 'ExpertLanguages' }">Mis Lenguages</router-link>
        <router-link :to="{ name: 'Profile' }">Mi Perfil</router-link>
      </div>
      <div class="actions">
        <button>
          <router-link :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
        </button>
        <button @click="logoutUser()">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { logout } from "../utils/helpers";
export default {
  name: "MenuExpert",
  props: {
    username: String,
  },
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
#nav {
  padding: 3rem;
  background-color: var(--ligthColor);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 10vh;
  text-align: left;
  text-decoration: none;
}

#nav .links a {
  padding: 1rem 0;
  background-color: var(--ligthColor);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 10vh;
  text-align: left;
  text-decoration: none;
}

.links {
  background-color: var(--ligthColor);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 10vh;
  text-align: left;
  text-decoration: none;
}

.actions {
  border-top: 1px solid var(--regularColor);
}
</style>
