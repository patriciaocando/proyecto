<template>
  <div>
    <div>
      <p>Búsqueda:</p>
      <input
        id="Search"
        name="Search"
        type="search"
        v-model="search"
        placeholder="Busca por palabras clave, autor, lenguaje, nombre de usuario"
        @click="showError = false"
      />
    </div>
    <div v-show="filter">
      <!--SELECCION DE LENGUAJE-->
      <label for="aviableLanguages">Lenguages:</label>
      <select id="aviableLanguages" name="aviableLanguages" v-model="language">
        <!-- <option>Selecciona un lenguage:</option> -->
        <option
          v-for="language in languages"
          :key="language.id"
          :value="language.name_language"
        >{{language.name_language}}</option>
      </select>

      <!--AUTOR-->
      <label for="autor">Autor:</label>
      <input type="text" id="autor" name="autor" v-model="autor" />

      <!--CHECKBOX RESPONDIDAS-->
      <label for="answered">Respondidas:</label>
      <input type="checkbox" id="answered" name="answered" value="check" v-model="status" />

      <!--RANGO DE FECHAS-->
      <label>Desde:</label>
      <input type="date" v-model="dateInit" />
      <label>Hasta:</label>
      <input type="date" v-model="dateEnd" />

      <!--ORDEN ASCENDENTE O DESCENDENTE-->
      <label for="direction">Ordenar por:</label>
      <select id="direction" name="direction" v-model="order">
        <option>Ordenar por:</option>
        <option value="DESC">Descendente</option>
        <option value="ASC">Ascendente</option>
      </select>

      <!--BOTON LIMPIAR FILTROS-->
      <button @click="ereaseFilters()">LIMPIAR FILTROS</button>
    </div>
    <!--MENSAJE DE ERROR-->
    <p v-show="showError">{{ errorMessage }}</p>

    <!--BOTONES DE BUSQUEDA-->
    <div>
      <button @click="sendSearchParams()">BUSCAR</button>
      <button @click="showFilter()">FILTROS</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  props: {
    questions: Array,
    languages: Array,
  },
  data() {
    return {
      search: "",
      status: "",
      date: "",
      dateInit: "",
      dateEnd: "",
      autor: "",
      order: "",
      language: "",
      showError: false,
      errorMessage: "",
      filter: false,
    };
  },
  methods: {
    sendSearchParams() {
      if (
        this.autor === "" &&
        this.order === "" &&
        this.search === "" &&
        this.language === "" &&
        this.dateInit === "" &&
        this.dateEnd === "" &&
        this.status === ""
      ) {
        this.errorMessage = "No has establecido ningun criterio de búsqueda";
        this.showError = true;
      } else {
        let queryParams = {
          name: this.autor.toLowerCase(),
          direction: this.order,
          search: this.search.toLowerCase(),
          language: this.language,
          date_init: this.dateInit,
          date_end: this.dateEnd,
          status: this.status,
        };
        console.log(queryParams.date_init);
        this.$emit("queryParams", queryParams);
      }
    },
    showFilter() {
      if (this.filter) {
        this.filter = false;
      } else {
        this.filter = true;
      }
    },

    ereaseFilters() {
      this.autor = "";
      this.order = "";
      this.search = "";
      this.language = "";
      this.dateInit = "";
      this.dateEnd = "";
      this.status = "";
      this.filter = true;
      location.reload();
    },
  },
};
</script>

<style scoped>
.questionInfo {
  text-align: left;
}

.autorInfo {
  display: flex;
  flex-direction: row;
}

#Search::-webkit-search-cancel-button {
  position: relative;
  right: 10px;

  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background: rgb(75, 75, 75);
}
</style>
