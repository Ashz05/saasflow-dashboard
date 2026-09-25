import axios from 'axios';
import { getMockResponse } from './mockService';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Grab standard Axios network adapter
const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  adapter: async (config) => {
    const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isLocalhostTarget = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

    // On Vercel / HTTPS without a valid remote backend, serve directly via mock engine with 0ms latency
    if ((isHttpsPage && isLocalhostTarget) || (isVercel && isLocalhostTarget)) {
      let parsedData = config.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch {
          // ignore
        }
      }
      const mock = getMockResponse(
        (config.method || 'GET').toUpperCase(),
        config.url || '',
        parsedData
      );
      if (mock) {
        return {
          data: mock.data,
          status: mock.status,
          statusText: 'OK',
          headers: {},
          config,
        };
      }
    }

    try {
      return await defaultAdapter(config);
    } catch (networkError: any) {
      // If remote request fails (e.g. offline backend), fallback smoothly to mock response
      let parsedData = config.data;
      if (typeof parsedData === 'string') {
        try {
          parsedData = JSON.parse(parsedData);
        } catch {
          // ignore
        }
      }
      const mock = getMockResponse(
        (config.method || 'GET').toUpperCase(),
        config.url || '',
        parsedData
      );
      if (mock) {
        return {
          data: mock.data,
          status: mock.status,
          statusText: 'OK',
          headers: {},
          config,
        };
      }
      throw networkError;
    }
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('saasflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('saasflow_refresh_token');
      if (!refreshToken) {
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('saasflow_token');
          localStorage.removeItem('saasflow_refresh_token');
          localStorage.removeItem('saasflow_user');
          window.location.href = '/login?session_expired=true';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let res;
        try {
          res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          }, { timeout: 3500 });
        } catch (networkErr: any) {
          const mock = getMockResponse('POST', '/auth/refresh');
          if (mock) {
            res = { data: mock.data };
          } else {
            throw networkErr;
          }
        }

        const { access_token, refresh_token: newRefreshToken, user } = res.data;
        localStorage.setItem('saasflow_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('saasflow_refresh_token', newRefreshToken);
        }
        if (user) {
          localStorage.setItem('saasflow_user', JSON.stringify(user));
        }

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('saasflow_token');
        localStorage.removeItem('saasflow_refresh_token');
        localStorage.removeItem('saasflow_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session_expired=true';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
