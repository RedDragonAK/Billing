import axios from 'axios'

// Use environment variable for API URL in production, or empty string for dev proxy
const API_URL = import.meta.env.VITE_API_URL || ''

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

// Export API_URL for direct use if needed
export { API_URL }




