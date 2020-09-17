<template>
  <div>
    <vue-headful title=":( Error | Tutorship" description="Error 404" />
    <div class="bannerContainer">
      <img class="bannerImage" src="../assets/landing/404.png" />
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style scoped>
.bannerContainer {
  background-image: url("../assets/landing/404-background.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 90vh;
}
.bannerImage {
  padding: 5rem;
  width: 50vw;
}

@media only screen and (min-width: 600px) {
}
/* 
@media only screen and (min-width: 800px) {
  .bannerContainer {
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
    width: 50vw;
  }
}

@media only screen and (min-width: 1200px) {
  .bannerContainer {
    height: 85vh;
  }
  .bannerContainer span {
    width: 40vw;
  }

  .bannerImage {
    background-position: left bottom;
    height: 85vh;
  }
} */
</style>

