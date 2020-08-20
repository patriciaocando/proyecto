<template>
  <div>
    <!--MENU PARA HOME-->

    <div id="nav">
      <div>
        <span>
          <a>
            <i></i>
          </a>
        </span>
        <figure>
          <img
            class="logoMenu"
            src="../assets/logoTutorshipLigth.svg"
            alt="logo-tutorships"
            @click="$router.push('/')"
          />
        </figure>
      </div>
      <keep-alive>
        <div class="metadataUser">
          <h5 class="ligth">¡HOLA! {{ username }}</h5>

          <figure>
            <img class="avatar" :src="avatar" alt="avatar" @click="$router.push('/perfil')" />
          </figure>
        </div>
      </keep-alive>
    </div>
    <!--MENUS-->
    <div id="layout">
      <div class="lateralmenu" v-if="role === 'experto'">
        <menuexpert />
        <!--  :username="username" -->
      </div>

      <div class="lateralmenu" v-if="role === 'estudiante'">
        <menustudent />
      </div>
      <main class="main">
        <slot />
      </main>
    </div>
    <footercustom class="footer" />
  </div>
</template>

<script>
import axios from "axios";
import footercustom from "@/components/FooterCustom.vue";
//COMPONENTES DE MENUS
import menuexpert from "@/components/MenuExpert.vue";
import menustudent from "@/components/MenuStudent.vue";

import {
  getAuthToken,
  getIdToken,
  getRoleToken,
  ENDPOINT,
  config,
} from "../utils/helpers";

export default {
  name: "MenuDashboard",
  components: {
    menuexpert,
    menustudent,
    footercustom,
  },
  data() {
    return {
      avatar: "",
      role: "",
      username: "",
      //TOKEN
      token: "",
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    async getRole(token) {
      this.role = await getRoleToken(token);
    },
    //TRAIGO LA INFO DEL PERFIL DE USUARIO DE LA BBDD
    async getUserProfile(token) {
      try {
        let idUserLoged = await getIdToken(token);

        const response = await axios.get(
          ENDPOINT + "/users/profile/" + idUserLoged,
          config
        );
        this.username = response.data.data.username;
        this.avatar = process.env.VUE_APP_STATIC + response.data.data.avatar;
        return response;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response;
        return null;
      }
    },
  },
  async created() {
    this.token = getAuthToken();
    await this.getUserProfile(this.token);
    await this.getRole(this.token);
  },
};
</script>

<style scoped>
#nav {
  padding: 1.5rem 3rem;
  background-color: var(--darkColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.metadataUser {
  display: none;
}
@media only screen and (min-width: 600px) {
  #nav {
    padding: 1rem 3rem;
    background-color: var(--darkColor);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  #nav .metadataUser {
    display: flex;
    direction: flex;
    flex-direction: row;
    justify-content: baseline;
    align-items: center;
  }
}

@media only screen and (min-width: 1200px) {
  #layout {
    display: grid;
    gap: 0;
    grid-template-columns: 320px 1fr;
    grid-template-rows: 1fr;
  }
  .logoMenu {
    margin-right: 50px;
  }

  .footer {
    margin-top: 0;
  }
}
</style>