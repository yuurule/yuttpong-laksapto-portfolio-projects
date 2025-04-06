import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// สร้าง baseAPI สำหรับเรียก public apis (ไม่ต้องการ authentication)
export const baseAPI: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// สร้าง authAPI สำหรับเรียก protected apis (ต้องการ authentication)
export const authAPI: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Add interceptor สำหรับแนบ token ใน authAPI เท่านั้น
authAPI.interceptors.request.use(
  async (config) => {
    // Get session from NextAuth instead from localStorage
    const session = await getSession();

    // ถ้ามี session และมี token ให้แนบกับ request
    if(session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },  
  (error) => Promise.reject(error)
);

// เพิ่ม response interceptors ให้ทั้ง 2 instance
const responseInterceptor = (response: any) => response.data;
const errorInterceptor = (error: any) => {
  if(error.response) {
    console.error('API Error:', error.response.data);
  } else if(error.request) {
    console.error('No response:', error.request);
  } else {
    console.error('Error:', error.message);
  }
  return Promise.reject(error);
}

baseAPI.interceptors.response.use(responseInterceptor, errorInterceptor);
authAPI.interceptors.response.use(responseInterceptor, errorInterceptor);

// Helper function สำหรับเลือกใช้ instance ที่เหมาะสม
export const getAPI = (requiresAuth: boolean = false): AxiosInstance => {
  return requiresAuth ? authAPI : baseAPI;
}

// Export เป็น default API สำหรับเรียกใช้
const API = {
  get: <T>(url: string, requiresAuth: boolean = false, config?: AxiosRequestConfig): Promise<T> => {
    return getAPI(requiresAuth).get(url, config);
  },

  post: <T>(url: string, data: any, requiresAuth: boolean = false, config?: AxiosRequestConfig): Promise<T> => {
    return getAPI(requiresAuth).post(url, data, config);
  },

  put: <T>(url: string, data: any, requiresAuth: boolean = false, config?: AxiosRequestConfig): Promise<T> => {
    return getAPI(requiresAuth).put(url, data, config);
  },

  delete: <T>(url: string, data?: any, requiresAuth: boolean = false, config?: AxiosRequestConfig): Promise<T> => {
    return getAPI(requiresAuth).delete(url, {
      ...config,
      data: data
    });
  },

  // สำหรับใช้ instance โดยตรง
  baseAPI,
  authAPI,
}

export default API;


