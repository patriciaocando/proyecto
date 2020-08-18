import jwt from "jwt-decode";
import axios from "axios";
const Swal = require("sweetalert2");

export const ENDPOINT = "http://localhost:3000";

/* export async function login(email, password) {
  try {
    let data = {
      email,
      password,
    };
    const response = await axios.post(`${ENDPOINT}/users/login`, data);
    setAuthToken(response.data.data);
  } catch (error) {
    console.log(err.response.status);
    if (err.response.status === 404) {
      alert(err.response.data.message);
    }
  }
} */

//OBJETO CONFIG
export const config = {
  headers: {
    Authorization: getAuthToken(),
  },
};

//GUARDAR EL LOCALSTORAGE EL JSONWEBTOKEN
//Bearer porador del token
export function setAuthToken(token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("AUTH_TOKEN_KET", token);
}

//RECUPERAR EL  TOKEN DEL LOCALSTORAGE
export function getAuthToken() {
  return localStorage.getItem("AUTH_TOKEN_KET");
}

//SACAR LA FECHA DE CADUCIDAD DE TOKEN
export function tokenData(encodedToken) {
  let token = jwt(encodedToken);
  if (!token.exp) {
    return null;
  }
  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

//SACAR ID TOKEN
export function getIdToken(encodedToken) {
  let token = jwt(encodedToken);
  if (token.id) {
    return token.id;
  } else {
    return null;
  }
}

//COMPROBAR EL ROLE DEL ADMINISTRADOR
export function getRoleToken(encodedToken) {
  let token = jwt(encodedToken);
  if (token.role) {
    return token.role;
  } else {
    return null;
  }
}

//COMPRUEBA SI EL TOKEN ES VALIDO
export function tokenValidation(token) {
  let expirationDate = tokenData(token);
  return expirationDate < new Date();
}

//COMPROBAR SI LA PERSONA ESTA LOGUEADA
export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !tokenValidation(authToken);
}

//LOGOUT
export function logout() {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem("AUTH_TOKEN_KET");
}

//FUNCION DE ALERT
export function alertFunction(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
}

////////////////////////////////////////////////////////////////
/* import { format, formatDistance, addMinutes } from "date-fns";
import es from "date-fns/locale/es";
   */
