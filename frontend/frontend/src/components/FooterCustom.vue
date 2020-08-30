<template>
  <div class="footer">
    <p class="ligth">Hack a Boss Bootcamp</p>
    <figure>
      <img
        class="logoMenu"
        src="../assets/logoTutorshipLigth.svg"
        alt="logo-tutorships"
        @click="$router.push('/')"
      />
    </figure>
    <p class="ligth">Design and development: Patricia Ocando</p>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
.logoMenu {
  margin: 1.5rem 0;
}
.footer {
  padding: 1.5rem 3rem;
  background-color: var(--darkColor);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

@media only screen and (min-width: 600px) {
  .footer {
    flex-direction: row;
    padding: 1.5rem 1.5rem;
  }
  .footer figure {
    flex-grow: 1;
  }
  .footer figure img {
    max-width: 100px;
  }
}
@media only screen and (min-width: 1200px) {
  /*  .footer figure img {
    max-width: 90px;
    position: fixed;
    bottom: 0;
  } */
}
</style>
