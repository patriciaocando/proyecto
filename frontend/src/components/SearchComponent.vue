<template>
  <div class="searchContent">
    <input
      @newSearch="ereaseFilters()"
      id="Search"
      name="Search"
      type="search"
      v-model="search"
      autocomplete="off"
      placeholder="Busca por palabras clave, autor, lenguaje, nombre de usuario"
      @click="showError = false"
    />

    <div class="filterContent" v-show="filter">
      <!--SELECCION DE LENGUAJE-->
      <div class="firstLineFilter">
        <label for="aviableLanguages">Lenguajes:</label>
        <select id="aviableLanguages" name="aviableLanguages" v-model="language">
          <!-- <option>Selecciona un lenguaje:</option> -->
          <option
            v-for="language in languages"
            :key="language.id"
            :value="language.language"
          >{{ language.language }}</option>
        </select>

        <!--AUTOR-->
        <label for="autor">Autor:</label>
        <input type="text" id="autor" name="autor" v-model="autor" />
      </div>

      <!--RANGO DE FECHAS-->
      <div class="dateContent">
        <label>Desde:</label>
        <input type="date" id="dateIni" v-model="dateInit" />
        <label>Hasta:</label>
        <input type="date" id="dateEnd" v-model="dateEnd" />
      </div>

      <!--ORDEN ASCENDENTE O DESCENDENTE-->
      <div class="orderContent">
        <label for="direction">Ordenar:</label>
        <select id="direction" name="direction" v-model="order">
          <option value="DESC">Descendente</option>
          <option value="ASC">Ascendente</option>
        </select>
        <!--CHECKBOX RESPONDIDAS-->
        <label class="answered" for="answered">
          Respondidas: SI
          <input
            type="checkbox"
            id="answered"
            name="answered"
            value="check"
            v-model="status"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <!--MENSAJE DE ERROR-->
    <p class="errorTxt" v-show="showError">{{ errorMessage }}</p>
    <!--BOTON LIMPIAR FILTROS-->
    <button v-show="filter" id="button3" @click="ereaseFilters()">LIMPIAR FILTROS</button>

    <!--BOTONES DE BUSQUEDA-->
    <div class="searchButtons">
      <button class="cancelButton" @click="newSearch()">BORRAR BÚSQUEDA</button>
      <button @click="sendSearchParams()">BUSCAR</button>
      <button id="button2" @click="showFilter()">FILTROS</button>
    </div>

    <span class="errorContainer" v-show="newSearchView">
      <p>{{ response }}</p>
      <button id="button2" @click="newSearch()">REALIZAR NUEVA BÚSQUEDA</button>
    </span>
  </div>
</template>

<script>
export default {
  name: "SearchComponent",
  props: {
    questions: Array,
    languages: Array,
    newSearchData: Object,
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
  computed: {
    response() {
      return this.newSearchData.response;
    },
    newSearchView() {
      return this.newSearchData.newSearchView;
    },
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
        this.$emit("queryParams", queryParams);
      }
    },
    showFilter() {
      this.filter = !this.filter;
    },
    newSearch() {
      this.filter = false;
      this.newSearchData.newSearchView = false;
      this.search = "";
      this.$emit("newSearch");
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
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Open Sans";
  font-size: 0.9rem;
  font-weight: var(--regularColor);
}
.errorContainer {
  display: block;
  min-height: 40vh;
  margin: 0 auto;
}
.errorTxt {
  margin: 1rem 0;
}

.searchContent {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: space-between;
  /*  margin: 0 auto; */
  width: 100%;

  border-radius: 8px;
}

/*INPUT PRINCIPAL DE BUSQUEDA*/
#Search {
  width: 100%;
  padding: 1.5rem 3rem;
  border: 1px solid var(--regularColor);
  background-image: url("../assets/icons/search.svg");
  background-repeat: no-repeat;
  background-position: 3% 50%;
  outline: 0;
  margin: 0;
}

/* #Search:hover,
#Search:focus {
  border: 1px solid #009688;
  background-color: white;
} */

.filterContent {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: space-around;
}
.firstLineFilter {
  /*   background-color: rgb(71, 212, 255); */
  margin-top: 1rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  align-content: stretch;
}

.dateContent {
  /* background-color: teal; */
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  align-content: stretch;
}
.orderContent {
  /*  background-color: violet; */
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  align-content: stretch;
}

#button3 {
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  background-image: url("../assets/icons/BORRAR.svg");
  background-repeat: no-repeat;
  background-position: 5% 50%;
  background-size: 16px;
  margin: 1rem 0;
}

/*BOTONES DE BUSQUEDA*/
.searchButtons {
  display: flex;
  justify-content: flex-end;
}

#aviableLanguages,
#autor,
#direction,
#dateIni,
#dateEnd {
  color: var(--textColor);
  width: 100%;
  height: 2rem;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  background-color: white;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--regularColor);
}

.answered {
  margin-top: 1rem;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.answered input {
  margin-left: 0.5rem;
}

/* @media only screen and (max-width: 900px) {
  .searchContent {
    background-color: var(--ligthBlue);
    border-radius: 8px;
  }
} */
@media only screen and (min-width: 600px) {
  /* .searchContent {
    width: 90vw;
  } */
}
@media only screen and (min-width: 900px) {
  /* .searchContent {
    width: 75vw;
  } */
  .filterContent {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-around;
    align-content: space-around;
    /* background-color: var(--ligthBlue); */
    border-radius: 8px;
  }

  #Search {
    background-position: 1% 50%;
  }

  #button3 {
    background-position: 40% 50%;
  }
}
</style>
