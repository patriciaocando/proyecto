import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import starrating from "vue-star-rating";

//LAYOUTS
import Public from "./layouts/Public.vue";
import Blank from "./layouts/Blank.vue";
import Dashboard from "./layouts/Dashboard.vue";

Vue.config.productionTip = false;
Vue.component("vue-headful", vueHeadful);
Vue.component("star-rating", starrating);
Vue.component("blank-layout", Blank);
Vue.component("public-layout", Public);
Vue.component("dashboard-layout", Dashboard);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
