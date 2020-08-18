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
        <!--GESTION DE ERRORES-->
        <p v-show="showError">{{ errorMessage }}</p>
      </div>
      <keep-alive>
        <figure>
          <img class="avatar" :src="avatar" alt="avatar" @click="$router.push('/perfil')" />
        </figure>
      </keep-alive>
    </div>
    <!--MENUS-->
    <div id="layout">
      <div class="lateralmenu" v-if="role === 'experto'">
        <menuexpert :username="username" />
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
      token: getAuthToken(),
      //variables de gestion de errores
      showError: false,
      errorMessage: "",
    };
  },
  methods: {
    async getRole(token) {
      this.role = await getRoleToken(this.token);
    },
    //TRAIGO LA INFO DEL PERFIL DE USUARIO DE LA BBDD
    async getUserProfile() {
      try {
        let idUserLoged = await getIdToken(this.token);

        const response = await axios.get(
          ENDPOINT + "/users/profile/" + idUserLoged,
          config
        );
        this.username = response.data.data.username;
        this.avatar = process.env.VUE_APP_STATIC + response.data.data.avatar;
      } catch (error) {
        this.showError = true;
        this.errorMessage = error.response;
      }
    },
  },
  created() {
    this.getUserProfile();
    this.getRole();
  },
};
</script>

<style scoped>
#layout {
  display: grid;
  gap: 0;
  grid-template-columns: 320px 1fr;
}
.logoMenu {
  margin-right: 50px;
}
#nav {
  padding: 1rem 3rem;
  background-color: var(--darkColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
/* .lateralmenu {
  position: fixed;
}
 */
.footer {
  margin-top: 0;
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