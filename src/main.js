import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import "@fortawesome/fontawesome-free/css/all.min.css";

import "@/scss/style.css";

import "animate.css";

createApp(App).use(store).use(router).mount("#app");
