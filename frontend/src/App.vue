<template>
  <div id="app">
    <menucustom />
    <!--     <h1>Titulos principales h1</h1>
    <h2>Titulos principales h2</h2>
    <h3>Titulos principales h3</h3>
    <h4>Titulos principales h4</h4>
    <p>Titulos textos</p>
    <p class="auxiliares">Titulos principales h1</p>-->
    <router-view class="body1" />
  </div>
</template>

<script>
//IMPORTO MENU
import menucustom from "@/components/MenuCustom.vue";

export default {
  name: "App",
  components: {
    menucustom,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,600;0,700;0,800;1,400&display=swap");

* {
  margin: 0;
  --blue: #337eff;
  --ligthBlue: #e6efff;
  --vibrantBLue: #33ddff;
  --ligthColor: #f8f8f8;
  --regularColor: #dedede;
  --mediumColor: #828282;
  --textColor: #5a5a5a;
  --darkColor: #3d3d3d;
  --letterSpacing: 0.25rem;
}
.body1 {
  margin: 0 2rem;
}

router-link {
  text-decoration: none;
}
#app {
  font-family: "Open Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--textColor);
}

h1 {
  font-style: bold;
  font-size: 1.6rem;
  line-height: 2rem;
  letter-spacing: 0.03rem;
  color: var(--darkColor);
}

h3 {
  font-style: bold;
  font-size: 1rem;
  line-height: 1.2rem;
  letter-spacing: 0.03rem;
  color: var(--darkColor);
  text-transform: uppercase;
}
h2 {
  font-style: bold;
  font-size: 1.3rem;
  line-height: 1.8rem;
  letter-spacing: 0.02rem;
  color: var(--darkColor);
}

h5 {
  font-style: regular;
  font-size: var(--unnamed-font-size-12);
  line-height: var(--unnamed-line-spacing-17);
  letter-spacing: var(--unnamed-character-spacing-0-12);
  color: var(--mediumgrey);
}
.accesibilidad {
  font-family: var(--unnamed-font-family-open-sans);
  font-style: var(--unnamed-font-style-regular);
  font-size: var(--unnamed-font-size-12);
  line-height: var(--unnamed-line-spacing-17);
  letter-spacing: var(--unnamed-character-spacing-0-12);
  color: var(--textcolor);
}
.textparrafo {
  font-family: var(--unnamed-font-family-open-sans);
  font-style: var(--unnamed-font-style-regular);
  font-size: var(--unnamed-font-size-14);
  line-height: var(--unnamed-line-spacing-24);
  letter-spacing: var(--unnamed-character-spacing-0-14);
  color: var(--textcolor);
}
.placeholdertext {
  font-family: var(--unnamed-font-family-open-sans);
  font-style: var(--unnamed-font-style-regular);
  font-size: var(--unnamed-font-size-14);
  line-height: var(--unnamed-line-spacing-21);
  letter-spacing: var(--unnamed-character-spacing-0-14);
  color: var(--unnamed-color-acacac);
}
.h4 {
  font-family: var(--unnamed-font-family-open-sans);
  font-style: var(--unnamed-font-style-regular);
  font-size: var(--unnamed-font-size-16);
  line-height: var(--unnamed-line-spacing-22);
  letter-spacing: var(--unnamed-character-spacing-0-16);
  color: var(--mediumgrey);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin: 0.5rem;
}

.accesibilityTxt {
  color: darkgrey;
}
button {
  /* display: block; */
  background-color: var(--blue);
  color: white;
  border: none;
  text-decoration: none;
  padding: 0.5rem 2rem;
  margin: 1rem;
  border-radius: 0.25rem;
}
.cancelButton {
  background-color: white;
  color: var(--mediumColor);
  border: none;
  text-decoration: none;
  padding: 0.5rem 2rem;
  margin: 1rem;
  border-radius: 0.25rem;
}

/* @media only screen and (max-width:600px)
@media only screen and (min-width:600px)
@media only screen and (max-width:992px)
@media only screen and (max-width:1200px) */
</style>
