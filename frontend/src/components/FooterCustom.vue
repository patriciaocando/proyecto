<template>
  <div class="footer">
    <p>Hack a Boss Bootcamp</p>
    <figure>
      <img
        class="logoMenu"
        src="../assets/logoTutorshipLigth.svg"
        alt="logo-tutorships"
        @click="$router.push('/')"
      />
    </figure>
    <p>Design and development: Patricia Ocando</p>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
.footer {
  color: var(--regularColor);
  font-weight: var(--ligth);
  font-size: 11px;
  padding: 1rem 1.5rem;
  background-color: var(--darkColor);
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  align-items: center;
  justify-content: space-evenly;
}

.footer figure img {
  max-width: 120px;
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
  .footer figure img {
    max-width: 90px;
  }
}
</style>