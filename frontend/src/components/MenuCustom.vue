<template>
  <div class="menuContainer">
    <!--MENU PARA HOME-->
    <div id="nav">
      <figure @click="activateMenu" class="iconMenu">
        <img src="../assets/icons/menu-movil.svg" alt="menu hamburguesa" />
      </figure>

      <figure class="logoMenu">
        <img
          src="../assets/logoTutorshipLigth.svg"
          alt="logo-tutorships"
          @click="$router.push('/')"
        />
      </figure>
    </div>
    <div class="navLinks" :class="{'responsiveMenu' : isActive }">
      <router-link :to="{ name: 'Home' }">Inicio</router-link>
      <router-link :to="{ name: 'About' }">Conócenos</router-link>
      <router-link :to="{ name: 'ListExperts' }">Nuestros expertos</router-link>

      <router-link v-if="isLoged" id="dashButton" :to="{ name: 'Dashboard' }">Mi dashboard</router-link>

      <router-link v-if="!isLoged" :to="{ name: 'Login' }">Login</router-link>
      <router-link v-if="!isLoged" id="registerButton" :to="{ name: 'Register' }">¡Regístrate!</router-link>
      <button class="hideMenu cancelButton" @click="activateMenu()">X CERRAR MENU</button>
      <button v-if="isLoged" id="logoutButton" @click="$emit('logout')">Logout</button>
    </div>
  </div>
</template>

<script>
import userData from "@/dataStorage/userData.js";

export default {
  name: "MenuCustom",
  data() {
    return {
      sharedStore: userData.state,
      isActive: true,
    };
  },
  computed: {
    isLoged() {
      return this.sharedStore.isLogged;
    },
  },
  methods: {
    activateMenu() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<style scoped>
.navLinks button#closeMenu {
  background-color: transparent;
  padding: 0;

  margin: 2rem 0;
}
.menuContainer {
  background-color: var(--darkColor);
  max-width: 100%;
}

#button2 {
  width: 130px;
  text-align: center;
  margin: 3rem;
}
#nav {
  padding: 1rem 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-content: flex-start;
  top: 0;
  background-color: var(--darkColor);
}
.logoMenu {
  flex-grow: 1;
}
.navLinks {
  display: flex;
  flex-direction: column;

  min-height: 100vh;
  position: fixed;
  left: 0;
  background-color: var(--darkColor);
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.25);
  transition: left 1s;
}
.cancelButton {
  background-color: transparent;
}
.navLinks a {
  text-align: left;
  font-weight: bold;
  color: var(--ligthColor);
  text-decoration: none;
  padding: 2rem 1rem;
  border-bottom: 1px solid var(--textColor);
  margin: 0 2rem;
}

#logoutButton {
  font-size: 1rem;
  text-align: left;
  font-weight: bold;
  color: var(--ligthColor);
  text-decoration: none;
  padding: 2rem 1rem;
  border-bottom: 1px solid var(--textColor);
  margin: 0 2rem;
  background: transparent;
}

.navLinks button {
  border-bottom: none;
  margin-left: 2rem;
}

.responsiveMenu {
  left: -220px;
}
@media only screen and (min-width: 600px) {
}

@media only screen and (min-width: 800px) {
  #logoutButton {
    font-size: 1rem;
    text-align: left;
    font-weight: bold;
    color: var(--ligthColor);
    text-decoration: none;
    padding: 0;
    border-bottom: 1px solid var(--textColor);
    margin: 0;
    background: none;
    text-decoration: none;
    border: none;
  }
  a#dashButton {
    /*texto*/
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.06rem;
    font-weight: var(--semiBold);
    /*fondo*/
    border: none;
    text-decoration: none;
    border-radius: 0.5rem;
    padding: 0.8rem 1.2rem;
    background-color: var(--ligthBlue);
    color: var(--blue);
  }
  #logoutButton {
    margin: 0;
  }
  #nav {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-content: flex-start;
  }

  #button2 {
    margin: 0 2rem;
    /* width: 80px; */
  }
  .hideMenu {
    display: none;
  }
  .menuContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .iconMenu {
    display: none;
  }

  .logoMenu {
    flex-grow: 0;
  }
  .navLinks {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    min-height: 70px;
    position: relative;
    width: 100%;
    box-shadow: 0 0 0;
  }
  .navLinks a {
    text-align: center;
    font-weight: bold;
    color: var(--ligthColor);
    text-decoration: none;
    border-bottom: 0px none;
    margin: 0 1rem;
    padding: 0;
  }
  .responsiveMenu {
    left: 0px;
  }

  #registerButton {
    margin-top: 0rem;
  }
}

@media only screen and (min-width: 1024px) {
  #nav {
    flex-direction: row;
  }
  .iconMenu {
    display: none;
  }

  .navLinks {
    justify-content: space-around;
    width: 50%;
  }
}
</style>
