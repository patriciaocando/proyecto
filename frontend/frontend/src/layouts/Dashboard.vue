<template>
  <div>
    <div id="topBar">
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

      <div class="metadataUser" v-if="isLogged">
        <h5 class="ligth">¡HOLA! {{ username }}</h5>

        <figure>
          <img
            class="avatar"
            :src="avatar"
            alt="avatar"
            @click="$router.push('/perfil')"
          />
        </figure>
      </div>
    </div>

    <!--GRID DE MENU Y CONTENIDO-->

    <sidebardashboard id="lateralmenu" @logout="logOut" />

    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script>
import axios from "axios";
import userData from "@/dataStorage/userData";
//import footercustom from "@/components/FooterCustom.vue";
//COMPONENTES DE MENUS
import sidebardashboard from "@/components/SidebarDashboard.vue";

export default {
  name: "Dashboard",
  props: {
    userId: String,
  },
  components: {
    sidebardashboard,
  },
  data() {
    return {
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
      //store del usuario
      sharedStore: userData.state,
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
  },
  methods: {
    logOut() {
      let currentRoute = this.$route.name;
      this.$emit("logout", currentRoute);
    },
  },
};
</script>

<style scoped>
#topBar {
  background-color: var(--darkColor);
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  align-content: flex-start;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
}

/* .lateralmenu {
  background-color: var(--ligthColor);
} */
/* .iconMenu {
  flex-grow: 1;
} */
.metadataUser {
  display: none;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

@media only screen and (min-width: 600px) {
  #topBar {
    padding: 1rem 3rem;
    background-color: var(--darkColor);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  #topBar .metadataUser {
    display: flex;
    direction: flex;
    flex-direction: row;
    justify-content: baseline;
    align-items: center;
  }
  .iconMenu {
    display: none;
  }
}
@media only screen and (min-width: 900px) {
  .iconMenu {
    display: none;
  }
  /*  #lateralmenu {
    display: none;
  } */
}

@media only screen and (min-width: 1200px) {
  .logoMenu {
    margin-right: 50px;
  }

  .main {
    padding-left: 296px;
    /* background-color: darkviolet; */
  }
  .iconMenu {
    display: none;
  }
}
</style>
