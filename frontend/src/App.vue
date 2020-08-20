<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
//IMPORTO MENU
//import menucustom from "@/components/MenuCustom.vue";
const publicLayout = "public";

export default {
  name: "App",
  components: {},
  computed: {
    layout() {
      return (this.$route.meta.layout || publicLayout) + "-layout";
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,600;0,700;0,800;1,400&display=swap");

* {
  margin: 0;
  /*COLORS*/
  --blue: #337eff;
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
}

#app {
  font-family: "Open Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--textColor);
  font-weight: var(--semiBold);
  line-height: 1.4rem;
}

.ligth {
  color: var(--ligthColor);
}

h1 {
  font-size: 1.6rem;
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
  font-size: 0.8rem;
  line-height: 1.2rem;
  letter-spacing: 0.03rem;
  color: var(--darkColor);
  text-transform: uppercase;
}
h4 {
  font-weight: var(--regular);
  font-size: 1rem;
  line-height: 22px;
  color: var(--mediumColor);
}

.accesibilityTxt {
  font-weight: var(--semiBold);
  font-size: 0.8rem;
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
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin: 0.5rem;
  margin-right: 0.5rem;
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
  border-radius: 0.25rem;
  background-color: var(--blue);
  /*separacion*/
  padding: 1rem 1.5rem;
  margin: 1rem 0.5rem;
}

#button2 {
  background-color: var(--ligthBlue);
  color: var(--blue);
}

#button3 {
  color: var(--darkColor);
  background-color: white;
  margin: 0.5rem;
  padding: 0.5rem;
}

.cancelButton {
  background-color: white;
  color: var(--mediumColor);
}

.simpleLink {
  text-decoration: none;
  color: var(--blue);
  text-transform: uppercase;
  font: 0.7rem var(--regular);
  letter-spacing: 0.08rem;
}

input {
  padding: 0.4rem 0.5rem;
  height: 1.2rem;
  border: 1px solid var(--regularColor);
  margin: 0.5rem 0.5rem;
  border-radius: 4px;
  background-color: white;
}

input:focus {
  outline: none;
  border-radius: 4px;
}

.languageStyle {
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
}
@media only screen and (min-width: 1200px) {
}

/* @media only screen and (max-width:600px)
@media only screen and (min-width:600px)
@media only screen and (max-width:992px)
@media only screen and (max-width:1200px) */
</style>
