import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vueHeadful from "vue-headful";
import starrating from "vue-star-rating";
import { format, formatDistance } from "date-fns";
import es from "date-fns/locale/es";

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

Vue.filter("getDistance", function(date) {
  return formatDistance(new Date(date), new Date(), { locale: es });
});

Vue.filter("getFormat", function(date) {
  return format(new Date(date), "dd/M/yyyy", { locale: es });
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
