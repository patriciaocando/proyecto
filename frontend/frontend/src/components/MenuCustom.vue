<template>
  <div>
    <!--MENU PARA HOME-->
    <div id="nav">
      <div>
        <figure class="iconMenu">
          <img src="../assets/icons/menu-movil.svg" alt="menu hamburguesa" />
        </figure>
        <figure>
          <img
            class="logoMenu"
            src="../assets/logoTutorshipLigth.svg"
            alt="logo-tutorships"
            @click="$router.push('/')"
          />
        </figure>
      </div>
      <router-link :to="{ name: 'Home' }">Inicio</router-link>
      <router-link :to="{ name: 'About' }">About</router-link>
      <router-link :to="{ name: 'ListExperts' }">Nuestros expertos</router-link>
      <router-link v-if="isLoged" :to="{ name: 'Dashboard' }"
        >Mi dashboard</router-link
      >
      <router-link v-if="!isLoged" :to="{ name: 'Login' }">Login</router-link>
      <button v-if="!isLoged">
        <router-link :to="{ name: 'Register' }">¡Regístrate!</router-link>
      </button>
      <button v-if="isLoged" id="button2" @click="$emit('logout')">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { logout, isLoggedIn, getAuthToken } from "../utils/helpers";
import userData from "@/dataStorage/userData.js";

export default {
  name: "MenuCustom",
  data() {
    return {
      sharedStore: userData.state,
    };
  },
  computed: {
    isLoged() {
      return this.sharedStore.isLogged;
    },
  },
};
</script>

<style scoped>
.logoMenu {
  margin-right: 50px;
}
#nav {
  padding: 1.5rem 3rem;
  background-color: var(--darkColor);
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

#nav a {
  font-weight: bold;
  color: var(--ligthColor);
  text-decoration: none;
}
@media only screen and (min-width: 900px) {
  .iconMenu {
    display: none;
  }
}

@media only screen and (min-width: 600px) {
  #nav {
    flex-direction: row;
  }
  .iconMenu {
    display: none;
  }
  #nav {
    padding: 1rem 2.5rem;
  }
}
@media only screen and (min-width: 1200px) {
  #nav {
    flex-direction: row;
  }
  .iconMenu {
    display: none;
  }
}
</style>
