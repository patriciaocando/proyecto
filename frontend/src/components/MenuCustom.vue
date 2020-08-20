<template>
  <div>
    <!--MENU PARA HOME-->
    <div id="nav">
      <div>
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
      <router-link v-if="isLoged" :to="{ name: 'Dashboard' }">Mi dashboard</router-link>
      <router-link v-if="!isLoged" :to="{ name: 'Login' }">Login</router-link>
      <button v-if="!isLoged">
        <router-link :to="{ name: 'Register' }">¡Regístrate!</router-link>
      </button>
      <button v-if="isLoged" id="button2" @click="logoutUser()">Logout</button>
    </div>
  </div>
</template>

<script>
import { logout, isLoggedIn, getAuthToken } from "../utils/helpers";
export default {
  name: "MenuCustom",
  data() {
    return {
      isLoged: false,
    };
  },
  methods: {
    logoutUser() {
      logout();
      this.$router.push("/login");
      location.reload();
    },
    showButtons() {
      this.isLoged = isLoggedIn();
    },
  },
  created() {
    this.showButtons();
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

@media only screen and (min-width: 600px) {
  #nav {
    flex-direction: row;
  }
  #nav a {
    font-size: 0.8rem;
  }
}
@media only screen and (min-width: 1200px) {
  #nav {
    flex-direction: row;
  }
  #nav a {
    font-size: 0.8rem;
  }
}
</style>
