import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
import 'bootstrap-icons/font/bootstrap-icons.css'
import {usePlayerStore} from "./stores/player.js";

const app = createApp(App)

// app.config.globalProperties.globalPlayer = null;
app.use(router)
app.use(createPinia())

app.mount('#app')
