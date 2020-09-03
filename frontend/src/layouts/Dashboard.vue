<template>
  <div>
    <div class="menuContainer">
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

      <!--USER DATA-->
      <div class="metadataUser" v-if="isLogged">
        <h5 class="ligth">
          ¡HOLA! {{ username }} /
          <i>{{role}}</i>
        </h5>

        <figure>
          <img class="avatar" :src="avatar" alt="avatar" @click="$router.push('/perfil')" />
        </figure>
      </div>
    </div>

    <!--GRID DE MENU Y CONTENIDO-->
    <div id="lateralMenu" :class="{'responsiveMenu' : isActive }">
      <!--SIDEBAR  EXPERTO-->
      <div class="navLinks">
        <router-link :to="{ name: 'Dashboard' }" class="home">Inicio</router-link>
        <router-link :to="{ name: 'UserQuestions' }" class="questions">Mis preguntas</router-link>
        <router-link
          :to="{ name: 'UserAnswers' }"
          class="answers"
          v-if="role === 'experto'"
        >Mis respuestas</router-link>
        <router-link
          :to="{ name: 'ExpertLanguages' }"
          class="languages"
          v-if="role === 'experto'"
        >Mis Lenguajes</router-link>
        <router-link :to="{ name: 'Profile' }" class="profile">Mi Perfil</router-link>
      </div>

      <div class="actions">
        <router-link id="questionButton" :to="{ name: 'NewQuestion' }">Hacer pregunta</router-link>
        <router-link
          v-if="role === 'estudiante'"
          class="becomeExpert"
          :to="{ name: 'BecomeExpert' }"
        >SER EXPERTO</router-link>
        <button class="cancelButton" @click="$emit('logout')">Logout</button>
      </div>
    </div>

    <main class="main" @click="deactivateMenu">
      <slot />
    </main>
  </div>
</template>

<script>
import axios from "axios";
import userData from "@/dataStorage/userData";

export default {
  name: "Dashboard",
  props: {
    userId: String,
  },
  data() {
    return {
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      //store del usuario
      sharedStore: userData.state,
      isActive: true,
    };
  },
  //computadas
  computed: {
    username() {
      return this.sharedStore.username;
    },
    avatar() {
      return this.sharedStore.avatar;
    },
    isLogged() {
      return this.sharedStore.isLogged;
    },
    role() {
      return this.sharedStore.role;
    },
  },
  methods: {
    logOut() {
      let currentRoute = this.$route.name;
      this.$emit("logout", currentRoute);
    },
    activateMenu() {
      console.log("activar");
      this.isActive = !this.isActive;
    },
    deactivateMenu() {
      if (this.isActive === false) {
        this.isActive = true;
      }
    },
  },
};
</script>

<style scoped>
#lateralMenu .navLinks a.home {
  background-image: url("../assets/icons/incio.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.home.router-link-exact-active {
  background-image: url("../assets/icons/incio-blue.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.questions {
  background-image: url("../assets/icons/questions.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.questions.router-link-exact-active {
  background-image: url("../assets/icons/questions-blue.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.answers {
  background-image: url("../assets/icons/answers.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.answers.router-link-exact-active {
  background-image: url("../assets/icons/answers-blue.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.languages {
  background-image: url("../assets/icons/languages.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.languages.router-link-exact-active {
  background-image: url("../assets/icons/languages-blue.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 18px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.profile {
  background-image: url("../assets/icons/profile.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 16px;
  padding-left: 4rem;
}

#lateralMenu .navLinks a.profile.router-link-exact-active {
  background-image: url("../assets/icons/profile-blue.svg");
  background-repeat: no-repeat;
  background-position: 10% 50%;
  background-size: 16px;
  padding-left: 4rem;
}

/*TOPBAR*/
.menuContainer {
  background-color: var(--darkColor);
  position: fixed;
  width: 100%;
  height: 64px;
}
#nav {
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-content: flex-start;
}
.logoMenu {
  flex-grow: 1;
}
.metadataUser {
  display: none;
}

/*LATERAL MENU*/

#lateralMenu {
  text-align: left;
  width: 200px;
  height: 100vh;
  top: 64px;
  position: fixed;
  background-color: var(--ligthColor);
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.25);
  transition: left 2s;
}

#lateralMenu .navLinks {
  display: flex;
  flex-direction: column;
}

#lateralMenu a {
  color: var(--darkColor);
  text-decoration: none;
  padding: 1.5rem;
}

#lateralMenu .actions a.becomeExpert {
  background-color: none;
  text-decoration: none;
  color: var(--darkColor);
  margin: 1rem;
  padding: 1rem 1rem 1rem 1.8rem;
  background-image: url("../assets/icons/experto.svg");
  background-repeat: no-repeat;
  background-position: 1% 50%;
  background-size: 16px;
  outline: 0;
  margin: 0;
}

#lateralMenu a.router-link-exact-active {
  color: var(--blue);
  background-color: var(--ligthBlue);
  max-width: 100%;
  text-decoration: none;
}

.actions {
  border-top: 1px solid var(--regularColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 5rem;
}

.cancelButton {
  background-color: transparent;
}

a#questionButton {
  /*texto*/
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: var(--semiBold);
  color: white;
  /*fondo*/
  border: none;
  text-decoration: none;
  border-radius: 0.5rem;
  background-color: var(--blue);
  /*separacion*/
  padding: 1rem 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.responsiveMenu {
  left: -200px;
}

/*MAIN*/
.main {
  min-width: 100vw;
  padding: 0;
}
/*FOOTER*/
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

@media only screen and (min-width: 600px) {
  /*TOPBAR*/
  .menuContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100vw;
    position: fixed;
  }
  #nav {
    width: 50%;
  }
  .logoMenu {
    flex-grow: 0;
  }
  .menuContainer .metadataUser {
    display: flex;
    direction: flex;
    flex-direction: row;
    justify-content: baseline;
    align-items: center;
  }
}

@media only screen and (min-width: 900px) {
  /*TOPBAR*/

  #nav {
    flex-direction: row;
    width: 65%;
    margin: 0;
    padding: 0;
  }
  .iconMenu {
    display: none;
  }

  #lateralMenu {
    box-shadow: 0 0 0;
  }

  #lateralMenu a {
    color: var(--darkColor);
    text-decoration: none;
    padding: 1rem;
  }

  .cancelButton {
    background-color: transparent;
  }

  a#questionButton {
    color: white;
  }

  .responsiveMenu {
    left: 0px;
  }

  /*MAIN*/
  .main {
    padding-left: 200px;
    min-width: 60vw;
    /* background-color: darkviolet; */
  }
}
</style>
