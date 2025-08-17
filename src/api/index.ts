import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
