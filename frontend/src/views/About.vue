<template>
  <div class="about">
    <vue-headful
      title="El proyecto | TutorShip"
      description="Acerca de TutorShip"
    />

    <div class="bannerContainer">
      <span>
        <h1>Acerca de TutorShip</h1>
        <p>
          Plataforma donde estudiantes de programación realizan consultas
          concretas a expertos en cada tecnología. Las preguntas están
          disponibles para todos los usuarios, las respuestas sólo para los
          usuarios registrados.
        </p>
      </span>
      <div class="bannerImage"></div>
    </div>

    <div id="tools">
      <div class="develop">
        <span class="text">
          <h1>Herramientas utilizadas</h1>
          <h3 class="ligth">programación</h3>
          <p>
            Para el desarrollo del proyecto se programó una base de datos
            específica mediante MySQL y MySQL Workbench, posteriormente se
            desarrolló para el Back-end una API REST con el uso de NodeJs y la
            utilización de dependencias nativas y externas de node como como
            date-fns, sharp, Lodash, dotenv, nodemon, entre otras. Finalmente
            para el desarrollo front-end se utilizó el framework VueJs para
            construir la interfaz con la aplicación de HTML y aplicar estilos
            mediante CSS3.
          </p>
        </span>

        <span class="icons">
          <ul>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/js.png"
                alt="logo-javascript"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/css.png"
                alt="logo-css"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/css.png"
                alt="logo-css"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/sql.png"
                alt="logo-sql"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/node.png"
                alt="logo-node"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/vue.png"
                alt="logo-vue"
              />
            </li>
          </ul>
        </span>
      </div>

      <div class="design">
        <span class="text">
          <h3 class="ligth">diseño</h3>
          <p>
            Para el diseño de la interfaz gráfica, primeramente se desarrollaron
            los wireframes en Adobe Xd, estudiando la usabilidad para el
            usuario, accesibilidad y navegabilidad. Se desarrolló un concepto
            gráfico de logo, determinación de paleta cromática y fuentes
            tipográficas a utilizar, creando un sistema de diseño estable y
            escalable.Para el diseño de iconos se utilizó la herramienta Adobe
            Illustrator y para las ilustraciones Adobe Photoshop.
          </p>
        </span>

        <span class="icons">
          <ul>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/xd.png"
                alt="logo-xd"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/ai.png"
                alt="logo-illustrator"
              />
            </li>
            <li>
              <img
                class="itemLogo"
                src="../assets/landing/ps.png"
                alt="logo-photoshop"
              />
            </li>
          </ul>
        </span>
      </div>
    </div>

    <div id="expert" class="bannerContainer">
      <span>
        <h1>¡Hola, soy Patricia Ocando!</h1>
        <p>
          Soy graduada en diseño gráfico y estudiante de programación Full Stack
          en Hack a Boss. Soy una persona empática, sociable, en constante
          aprendizaje y crecimiento. Me gusta ayudar a todos en mi equipo y
          tengo alto sentido de responsabilidad. Tengo amplia experiencia
          trabajando en remoto, participando en equipos de desarrollo de
          aplicaciones móviles y web.
        </p>
        <a class="button" href="https://www.linkedin.com/in/patricia-ocando/"
          >¡CONTÁCTAME!</a
        >
      </span>
      <div class="bannerImage"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
h3 {
  font-size: 1.5rem;
  margin: 2rem 0;
}
.bannerContainer {
  min-height: 40vh;
}
h1 {
  display: block;
  font-size: 3em;
  padding-top: 5rem;
  line-height: 3.5rem;
}

.bannerContainer p,
#expert p {
  display: block;
  font-weight: var(--semiBold);
  line-height: 2.5rem;
  font-size: 1.8em;
  padding: 2rem;
}
.bannerImage {
  background-image: url("../assets/landing/acerca.png");
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 40vh;
}

#tools {
  background-color: var(--darkColor);
  color: var(--ligthColor);
  padding: 2rem 0;
}

#tools p {
  margin: 0 2rem;
  color: var(--ligthColor);
  font-weight: var(--regular);
  line-height: 2.5rem;
  font-size: 1.8em;
}

#tools h1 {
  padding-top: 3rem;
  color: var(--ligthColor);
  font-size: 2rem;
}

#tools ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: 2rem auto;
}

#tools .develop {
  border-bottom: 1px solid var(--regularColor);
  margin-bottom: 6vh;
}

#tools ul li {
  padding: 1rem;
}

#expert {
  background-image: none;
  background-color: white;
  min-height: 60vh;
  margin: 0;
  margin-top: 2rem;
}

#expert .bannerImage {
  background-image: url("../assets/landing/patricia.png");
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 60vh;
  margin: 0;
}

@media only screen and (min-width: 600px) {
}

@media only screen and (min-width: 800px) {
  h3 {
    text-align: left;
    font-size: 1rem;
  }

  h1 {
    text-align: left;
    font-size: 2em;
    padding-top: 2rem;
    line-height: 2.5rem;
  }

  .bannerContainer p,
  #expert p {
    text-align: left;
    font-weight: var(--semiBold);
    line-height: 1.5rem;
    font-size: 1rem;
    padding: 0rem;
    margin-top: 2rem;
  }

  .bannerContainer,
  #tools {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    align-content: flex-start;
    height: 60vh;
  }
  .bannerContainer span {
    width: 30vw;
  }

  .bannerImage {
    background-position: right bottom;
    height: 60vh;
    width: 60vw;
  }

  #tools {
    height: 100%;
    padding: 2rem;
  }

  #tools p {
    color: var(--ligthColor);
    text-align: left;
    font-weight: var(--semiBold);
    line-height: 1.5rem;
    font-size: 1rem;
    padding: 0rem;
    margin: 0rem;
  }

  #tools .develop,
  #tools .design {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #tools ul li {
    padding: 1rem;
  }
  .button {
    display: block;
    margin: 2rem 0;
  }

  #expert,
  #expert .bannerImage {
    min-height: 70vh;
    margin: 0;
  }
}

@media only screen and (min-width: 1200px) {
  .bannerContainer {
    height: 85vh;
  }

  .bannerContainer span h1 {
    width: 30vw;
    font-size: 1.4rem;
    line-height: 2rem;
  }
  #tools {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: stretch;
  }

  #tools .develop {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: stretch;
    align-items: center;
    align-content: center;
  }

  #tools .develop .text {
    padding-bottom: 3rem;
  }
  .text {
    max-width: 40vw;
    height: 40vh;
    margin-left: 8rem;
    /* margin: 2rem; */
  }

  #tools .develop ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 2rem;
    max-width: 60%;
  }

  #tools .design ul {
    height: 30vh;
    margin: 2rem;
  }

  .bannerImage {
    background-position: center bottom;
    height: 85vh;
  }

  #tools .design {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .button {
    width: 80px;
  }

  #expert span {
    display: flex;
    flex-direction: column;
  }
}
</style>
