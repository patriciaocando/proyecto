<template>
  <div id="app">
    <vue-headful title="TutorShip" description="TutorShip" />
    <component :is="layout" class="principal" @logout="logOut">
      <router-view @doLogin="getUserData" />
    </component>
    <!--  <footercustom class="footer" /> -->
  </div>
</template>

<script>
//STORAGE DE LOS DATOS DE USUARIO
import userData from "@/dataStorage/userData";
import api from "@/api/api";
const publicLayout = "public";

export default {
  name: "App",
  data() {
    return {
      userId: null,
      token: null,
      sharedStore: userData.state,
    };
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || publicLayout) + "-layout";
    },
    isAuthenticated() {
      return this.token !== "";
    },
  },
  created() {
    console.log("1");
    let token = localStorage.getItem("AUTH_TOKEN_KET");

    if (token !== null) {
      this.token = token;
      api.setAuthToken(this.token);
      const response = api.getUserTokenId(this.token);
      if (response !== null) {
        this.userId = response.id;
        this.setData();
      }
    }
  },
  methods: {
    async getUserData(token) {
      // let token = localStorage.getItem("AUTH_TOKEN_KET");
      console.log("2", token);

      if (token !== null) {
        this.token = token;
        localStorage.setItem("AUTH_TOKEN_KET", this.token);
        const response = await api.getUserTokenId(this.token);
        if (response !== null) {
          this.userId = response.id;
          await this.setData();
        }
      }
    },

    async setData() {
      const user = await api.getUserProfile(this.userId);
      console.log("setData", user);
      if (user !== null) {
        console.log(user);
        this.sharedStore.id = this.userId;
        this.sharedStore.token = this.token;
        this.sharedStore.username = user.username;
        this.sharedStore.role = user.role;
        this.sharedStore.avatar = process.env.VUE_APP_STATIC + user.avatar;
        this.sharedStore.email = user.email;
        this.sharedStore.name = user.name;
        this.sharedStore.lastname = user.lastName;
        this.sharedStore.profile = user.profile;
        this.sharedStore.isLogged = this.isAuthenticated;

        this.$router.push({ name: "Dashboard" });
      }
    },
    async logOut(currentRoute) {
      const response = await api.logout();
      console.log("logout", response);
      if (response !== null || response !== undefined) {
        this.token = null;
        this.userId = null;
        this.sharedStore.id = null;
        this.sharedStore.role = null;
        this.sharedStore.token = null;
        this.sharedStore.username = null;
        this.sharedStore.avatar = null;
        this.sharedStore.email = null;
        this.sharedStore.name = null;
        this.sharedStore.lastname = null;
        this.sharedStore.profile = null;
        this.sharedStore.isLogged = false;
      }

      if (currentRoute !== "Home") {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,600;0,700;0,800;1,400&display=swap");

/* html,
body {
  height: 100%;
} */

* {
  margin: 0;
  /*COLORS*/
  --blue: #0760f9;
  --darkBlue: #044ac1;
  --ligthBlue: #e6efff;
  --vibrantBLue: #33ddff;
  --ligthColor: #e8e8e8;
  --regularColor: #dedede;
  --mediumColor: #7e7e7e;
  --textColor: #5a5a5a;
  --darkColor: #3d3d3d;
  --red: #b32009;
  --js: #fff07a;
  --jsf: #463e00;

  /*FONTS*/
  --ligth: 300;
  --regular: 400;
  --semiBold: 600;
  --bold: 700;
  --extraBold: 800;
  font-size: 13px;
}
.principal {
  flex: 1 0 auto;
}

#app {
  font-family: "Open Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--textColor);
  font-weight: var(--semiBold);
  line-height: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}
/* .footer {
  flex-shrink: 0;
} */

/*contenedor para vistas de dashboards */
.container {
  width: 90%;
  margin: 0 auto;
  padding: 80px 2rem 4rem 2rem;
  text-align: left;
}

.ligth {
  color: var(--ligthColor);
}

h1 {
  font-size: 1.4rem;
  line-height: 2rem;
  letter-spacing: 0.03rem;
  color: var(--darkColor);
}

h2 {
  font-style: var(--bold);
  font-size: 1.2rem;
  line-height: 1.8rem;
  letter-spacing: 0.02rem;
  color: var(--darkColor);
}

h3 {
  font-weight: var(--bold);
  font-size: 1rem;
  line-height: 1.2rem;
  letter-spacing: 0.03rem;
  color: var(--darkColor);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
h4 {
  font-weight: var(--regular);
  font-size: 1rem;
  line-height: 22px;
  color: var(--mediumColor);
}

.accesibilityTxt {
  font-weight: var(--semiBold);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  letter-spacing: 0.12px;
  color: var(--textColor);
}

.errorTxt {
  font-weight: var(--semiBold);
  font-size: 0.8rem;
  line-height: 17px;
  letter-spacing: 0.12px;
  color: var(--red);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 24px;
  margin: 0.5rem;
  margin-right: 0.5rem;
}

.emptyState {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

/* ///////////// BOTONES //////////////*/
#registerButton {
  /*texto*/
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
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
}
.deleteButton {
  background-image: url("./assets/icons/BORRAR.svg");
  background-repeat: no-repeat;
  background-position: 5% 50%;
  background-size: 16px;
  margin: 0;
  padding-left: 2rem;
  background-color: transparent;
  color: var(--darkColor);
}

.deleteButton:hover {
  background-image: url("./assets/icons/open-basket.svg");
  background-repeat: no-repeat;
  background-position: 4% 50%;
  background-size: 16px;
  margin: 0;
  padding-left: 2rem;
  background-color: transparent;
  color: var(--darkColor);
}

#editButton {
  background-image: url("./assets/icons/EDITAR.svg");
  background-repeat: no-repeat;
  background-position: 3% 50%;
  outline: 0;
  margin: 0;
  background-color: white;
  color: var(--mediumColor);
  padding: 1rem 1rem 1rem 1.8rem;
}

button {
  /*texto*/
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
  font-weight: var(--semiBold);
  color: white;
  /*fondo*/
  border: none;
  text-decoration: none;
  border-radius: 0.5rem;
  background-color: var(--blue);
  /*separacion*/
  padding: 1rem 1.5rem;
  margin: 1rem 0.5rem;
  border: none;
}
button:focus {
  outline: none;
}

button:hover {
  background-color: var(--darkBlue);
}
.button {
  /*texto*/
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
  font-weight: var(--semiBold);
  color: white;
  /*fondo*/
  border: none;
  text-decoration: none;
  border-radius: 0.5rem;
  background-color: var(--blue);
  /*separacion*/
  padding: 1rem 1.5rem;
  /* margin: 1rem 0.5rem; */
}

#button2 {
  background-color: var(--ligthBlue);
  color: var(--blue);
}

#button2:hover {
  color: var(--textColor);
}

#button3 {
  color: var(--darkColor);
  background-color: white;
  margin: 1rem 0.5rem 0.5rem 0.5rem;
  padding: 0.5rem;
}

.cancelButton {
  background-color: white;
  color: var(--mediumColor);
}

.cancelButton:hover {
  background-color: white;
  color: var(--darkBlue);
}

.simpleLink {
  text-decoration: none;
  color: var(--blue);
  text-transform: uppercase;
  font: 0.7rem var(--regular);
  letter-spacing: 0.08rem;
}

/*/////////////////// INPUTS ///////////////// */
input {
  font-family: "Open Sans";
  font-weight: var(--semiBold);
  color: var(--textColor);
  font-size: 1rem;
  line-height: 1.3;
  padding: 0.8rem 1rem;
  height: 1.2rem;
  border: 1px solid var(--regularColor);
  margin: 0.5rem 0;
  border-radius: 4px;
  background-color: white;
}

input:focus {
  outline: none;
  border-radius: 4px;
}

textarea {
  font-family: "Open Sans";
  font-size: 1rem;
  line-height: 1.3;
  color: var(--textColor);
  font-weight: var(--semiBold);
  width: 90%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--regularColor);
  height: 20rem;
}

textarea:focus {
  outline: none;
  border-radius: 4px;
}

/*///////// TITULOS //////////*/
#sectionTitle h1,
#sectionTitle h2 {
  text-align: left;
  margin-bottom: 1rem;
}

#aviableLanguages {
  color: var(--textColor);
  width: 100%;
  height: 2rem;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  background-color: white;
  box-sizing: border-box;
  border-radius: 4px;
}

.languageStyle {
  display: block;
  background-color: var(--mediumColor);
  color: var(--ligthColor);
  font-size: 12px;
  font-weight: var(--semiBold);
  text-align: center;
  letter-spacing: 0.24px;
  max-width: 56px;
  padding: 0.2rem 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}

#languageStyle {
  display: block;
  text-transform: none;
  font-size: 12px;
  font-weight: var(--semiBold);
  text-align: center;
  letter-spacing: 0.24px;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 4px;
}

#languageStyle:focus {
  outline: none;
}
.buttonsContainer,
.buttonsInsideContainer {
  margin: 0 1rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: space-around;
  justify-content: space-around;
  align-content: stretch;
}

.titleInput {
  width: 90%;
}

.javascript {
  background-color: var(--js);
  color: var(--jsf);
}
.css3 {
  background-color: #96d1fb;
  color: #0b6cb1;
}

.html {
  color: white;
  background-color: #e65a22;
}

.java {
  color: #e65a22;
  background-color: white;
}

.vue {
  color: #35495e;
  background-color: #41b883;
}

.node {
  color: #404137;
  background-color: #83cd29;
}

.angular {
  color: white;
  background-color: #dd1b16;
}

.php {
  color: white;
  background-color: #4f5b93;
}

.sql {
  color: white;
  background-color: #157efb;
}

@media only screen and (min-width: 600px) {
  .languageStyle {
    margin: 0 0.5rem;
  }
  .container {
    margin: 2rem auto;
  }
}

@media only screen and (min-width: 900px) {
  .languageStyle {
    margin: 0 0.5rem;
  }
}

@media only screen and (min-width: 1024px) {
  /* .container {
    width: 70%;
    margin: 5rem 3rem 0 0;
    padding-top: 2rem;
    padding-bottom: 4rem;
    text-align: left;
  } */
}

/* @media only screen and (max-width:600px)
@media only screen and (min-width:600px)
@media only screen and (max-width:992px)
@media only screen and (max-width:1200px) */
</style>
