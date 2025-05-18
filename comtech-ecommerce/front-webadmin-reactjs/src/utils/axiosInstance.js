import axios from 'axios';
import { store } from '../redux/store';
import { refreshTokenAction } from '../redux/actions/authAction';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if((error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await store.dispatch(refreshTokenAction());
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;