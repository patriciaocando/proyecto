<template>
  <div id="nav">
    <img class="logoMenu" src="../assets/logoTutorshipLigth.svg" />
    <router-link :to="{ name: 'Home' }">Inicio</router-link>|
    <router-link :to="{ name: 'About' }">About</router-link>|
    <router-link :to="{ name: 'ListExperts' }">Nuestros expertos</router-link>|
    <router-link :to="{ name: 'Login' }">Login</router-link>
    <button>
      <router-link :to="{ name: 'Register' }">¡Regístrate!</router-link>
    </button>
  </div>
</template>

<script>
import { logout } from "../utils/helpers";
export default {
  name: "MenuCustom",
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
  padding: 30px;
  background-color: var(--darkColor);
  margin-bottom: 5rem;
}

#nav a {
  font-weight: bold;
  color: var(--ligthColor);
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: var(--ligthBlue);
  text-decoration: underline;
}
.logoMenu {
  margin-right: 50px;
}
</style>
