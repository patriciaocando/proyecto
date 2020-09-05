<template>
  <div>
    <vue-headful
      title="Activación de Experto | Tutorship"
      description="Activar usuario en la plataforma"
    />
    <h1>Petición de experto</h1>
    <p>
      EL usuario {{ idUserRequest }} solicita hacerse experto en los languages
      {{ languagesRequest }}
    </p>
    <button @click="validateExpert()">SÍ! HACERLO EXPERTO</button>
  </div>
</template>

<script>
import api from "@/api/api.js";
import { alertFunction } from "../utils/helpers";

export default {
  name: "ExpertValidation",
  data() {
    return {
      //variables de peticoon de usuario
      idUserRequest: "",
      languagesRequest: "",
    };
  },
  computed: {
    token() {
      return this.sharedStore.token;
    },
    role() {
      return this.sharedStore.role;
    },
  },
  methods: {
    getRequestData() {
      let [, url] = window.location.href.split("id=");
      let [userId, languages] = url.split("&lang=");
      this.idUserRequest = userId;
      this.languagesRequest = languages;
      //console.log(getRoleToken(this.token));
    },
    async validateExpert() {
      try {
        const response = await api.validateExpert(this.idUserReques, this.role);

        alertFunction(
          "success",
          "Nuevo Experto",
          `Has dado de alta a un nuevo experto en TutorShips`
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
  created() {
    this.getRequestData();
  },
};
</script>

<style scoped></style>
