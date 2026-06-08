import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only a 401 (invalid/expired session) should force a logout.
    // A 403 means "forbidden" (e.g. unverified email, admin-only) — keep the session.
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      Cookies.remove('accessToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  signup: (data: { username: string; password: string; firstName: string; lastName: string }) =>
    api.post('/user/signup', data),
  signin: (data: { username: string; password: string }) => api.post('/user/signin', data),
  logout: (refreshToken: string) => api.post('/user/logout', { refreshToken }),

  // User
  getUser: () => api.get('/user/getUser'),
  getAllUsers: () => api.get('/user/getAllUsers'),
  bulkSearch: (filter: string) => api.get('/user/bulk', { params: { filter } }),
  getOtherUsers: (filter: string) => api.get('/user/otherusers', { params: { filter } }),

  // Account
  getBalance: () => api.get('/account/balance'),
  lookupByNumber: (walletNumber: string) => api.get(`/account/lookup/${walletNumber}`),
  transfer: (data: { to?: string; walletNumber?: string; currency: string; amount: number }) =>
    api.post('/account/transfer', data),
  exchange: (data: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
  }) => api.post('/account/exchange', data),

  // Transactions
  getTransactionHistory: () => api.get('/transaction/history'),
  getTransaction: (id: string) => api.get(`/transaction/history/${id}`),
};

export default api;
