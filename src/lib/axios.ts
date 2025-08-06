// src/lib/axios.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { environment } from './../enviroments/enviroment';

export const api = axios.create({
  baseURL: environment.BASE_API_URL+'/api',
  withCredentials: true,
});

// Optional: Token getter function
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;  // <-- token is required, not optional
  reject: (error: AxiosError) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle 401 and token refresh logic
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({
            resolve,   // exact signature: (token: string | null) => void
            reject,
          });
        }).then((token) => {
          if (token && originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // TODO: Implement your token refresh logic here
        // Example:
        // const response = await refreshToken();
        // const newToken = response.data.accessToken;
        // localStorage.setItem('accessToken', newToken);
        // processQueue(null, newToken);
        // return api(originalRequest);

        throw new Error('Unauthorized – refresh token flow not implemented');
      } catch (err) {
        processQueue(err as AxiosError, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
