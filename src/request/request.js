import axios from 'axios'

// create an axios instance
const service = axios.create({
    baseURL: `https://127.0.0.1:8000`, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 70000, // request timeout,
    headers:{
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Request-Headers": "https://127.0.0.1:8000",
    },
})

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Request-Headers'] = 'https://127.0.0.1:8000';

export default service
