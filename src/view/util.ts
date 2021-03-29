import Axios from 'axios'





export const axios = () => {
    return Axios.create({
        baseURL: window.config.AUTH_URL
    })

}