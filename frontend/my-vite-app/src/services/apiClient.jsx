import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});