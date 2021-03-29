import Axios from 'axios';

export const config: {
    AUTH_URL: string
} = window.config

export const axios = () => {
    // @ts-ignore
    
    return Axios.create({
        baseURL: config.AUTH_URL
    })
}