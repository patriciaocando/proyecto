<template>
  <div>
    <MenuCustom @logout="logOut" />
    <main class="main">
      <slot />
    </main>
    <FooterCustom />
  </div>
</template>

<script>
import MenuCustom from "@/components/MenuCustom.vue";
import FooterCustom from "@/components/FooterCustom.vue";
export default {
  name: "Public",
  components: { MenuCustom, FooterCustom },
  methods: {
    logOut() {
      let currentRoute = this.$route.name;
      this.$emit("logout", currentRoute);
    },
  },
};
</script>

<style></style>
