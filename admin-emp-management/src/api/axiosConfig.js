// src/api/axiosConfig.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Set the base URL for the API
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Ensure credentials (cookies) are sent with each request
axios.defaults.withCredentials = true;

// Add an interceptor to include the Authorization header dynamically
axios.interceptors.request.use((config) => {
  const token = Cookies.get('token'); // Fetch the token from cookies
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;