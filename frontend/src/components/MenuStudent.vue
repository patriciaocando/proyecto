<template>
  <div id="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link>|
    <router-link :to="{ name: 'UserQuestions' }">Mis preguntas</router-link>|
    <router-link :to="{ name: 'Profile' }">Mi Perfil</router-link>|
    <button>
      <router-link :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
    </button>
    <router-link :to="{ name: 'BecomeExpert' }">SER EXPERTO</router-link>|
    <button @click="logoutUser()">Logout</button>
  </div>
</template>

<script>
import { logout } from "../utils/helpers";
export default {
  name: "MenuStudent",
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
