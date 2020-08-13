<template>
  <div>
    <img src="../assets/logoTutorshipLigth.svg" />

    <img :src="avatar" />
  </div>
</template>

<script>
export default {
  name: "MenuInternal",
  props: {
    avatar: String,
  },
};
</script>

<style scoped>
* {
  background-color: var(--darkColor);
}
</style>