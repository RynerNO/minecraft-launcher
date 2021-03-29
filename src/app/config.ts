import dotenv from 'dotenv';
dotenv.config()

export default {
    AUTH_URL: process.env.AUTH_URL || 'http://localhost:5001'
}