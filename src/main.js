import { createApp } from 'vue'
import Toast, {useToast} from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import App from './App.vue'
import {createPinia} from "pinia";
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

// app.config.globalProperties.globalPlayer = null;
app.use(router)
app.use(createPinia())
const options = {
    // You can set your default options here
};

app.use(Toast, options);

const toast = useToast()
app.config.globalProperties.$toast = toast;
app.mount('#app');

export default app;