<template>
  <div id="nav">
    <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>|
    <router-link :to="{ name: 'UserQuestions' }">Mis preguntas</router-link>|
    <router-link :to="{ name: 'UserAnswers' }">Mis respuestas</router-link>|
    <router-link :to="{ name: 'ExpertLanguages' }">Mis Lenguages</router-link>|
    <router-link :to="{ name: 'Profile' }">Mi Perfil</router-link>|
    <button @click="logoutUser()">Logout</button>
  </div>
</template>

<script>
import { logout } from "../utils/helpers";
export default {
  name: "MenuExpert",
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
