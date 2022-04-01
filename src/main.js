import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.config.globalProperties.globalPlayer = null;
app.use(router)

app.mount('#app')
