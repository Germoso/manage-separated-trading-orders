import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Agrega el token a los encabezados
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // You can handle the response here
    return response;
  },
  (error) => {
    // You can handle the error here
    return Promise.reject(error);
  }
);

export default axiosInstance;