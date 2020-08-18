<template>
  <div>
    <MenuCustom />
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
};
</script>

<style>
</style>