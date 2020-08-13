import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { isLoggedIn, getAuthToken, getRoleToken } from "../utils/helpers.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      allowAll: true,
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      allowAll: true,
    },
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
    meta: {
      allowAll: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      allowAll: true,
    },
  },
  {
    path: "/registrate",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      allowAll: true,
    },
  },
  {
    path: "/activar",
    name: "RegisterValidation",
    component: () => import("../views/RegisterValidation.vue"),
    meta: {
      allowAll: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/nueva-pregunta",
    name: "NewQuestion",
    component: () => import("../views/NewQuestion.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/mis-preguntas",
    name: "UserQuestions",
    component: () => import("../views/UserQuestions.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/ser-experto",
    name: "BecomeExpert",
    component: () => import("../views/BecomeExpert.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/expertos",
    name: "ListExperts",
    component: () => import("../views/ListExperts.vue"),
    meta: {
      allowAll: false,
    },
  },
  //ADMIN
  {
    path: "/validar-experto",
    name: "ExpertValidation",
    component: () => import("../views/ExpertValidation.vue"),
    meta: {
      allowAll: false,
      onlyAdmin: true,
    },
    beforeEnter: (to, from, next) => {
      let token = getAuthToken();
      if (to.meta.onlyAdmin === true && getRoleToken(token) !== "admin") {
        next({
          path: "/home",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/mis-respuestas",
    name: "UserAnswers",
    component: () => import("../views/UserAnswers.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/mis-lenguages",
    name: "ExpertLanguages",
    component: () => import("../views/ExpertLanguages.vue"),
    meta: {
      allowAll: false,
    },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      allowAll: false,
    },
  },
  {
    path: "/recover-password",
    name: "RecoverPassword",
    component: () => import("../views/RecoverPassword.vue"),
    meta: {
      allowAll: false,
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  //que tipo de meta tiene la ruta
  if (!to.meta.allowAll && !isLoggedIn) {
    next({
      path: "/",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
