import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import starrating from "vue-star-rating";

Vue.config.productionTip = false;
Vue.component("vue-headful", vueHeadful);
Vue.component("star-rating", starrating);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
