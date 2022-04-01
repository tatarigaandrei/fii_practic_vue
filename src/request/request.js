import axios from 'axios'
import app from "../main";

const service = axios.create({
    baseURL: `https://127.0.0.1:8000`, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 70000, // request timeout,
    headers:{
        // "Access-Control-Allow-Origin": "https://127.0.0.1:8000",
        // "Access-Control-Request-Headers": "https://127.0.0.1:8000",
    },
})

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Request-Headers'] = 'http://127.0.0.1:8000';

// response interceptor
service.interceptors.response.use(
    response => {
       return response
    },
    async error => {
        if (error.response.status === 400) {
            const messages = []
            Object.keys(error.response.data).forEach((item, index) => {
                if (Object.prototype.toString.call(error.response.data[item]) === '[object Array]') {
                    for (const subItem of error.response.data[item]) {
                        messages[item] = subItem
                    }
                }
            })

            for (const prop in messages) {
                let message = `${prop} - ${messages[prop]}`
                app.config.globalProperties.$toast.error(message)
            }
        }

        return Promise.reject(error)

    }
)
export default service
