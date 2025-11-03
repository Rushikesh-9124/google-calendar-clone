import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://google-calendar-clone-3.onrender.com/api/events',
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use((config)=>{
    const accessToken = localStorage.getItem("token")
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
}, (error)=>{
    return Promise.reject(error)
})

export default axiosInstance
