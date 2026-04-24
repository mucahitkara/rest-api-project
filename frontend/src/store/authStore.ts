'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, RegisterData } from '@/types';
import { apiService } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  initializeAuth: async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const response = await apiService.getUser();
      set({ user: response.data, isAuthenticated: true, accessToken: token, isLoading: false });
    } catch {
      Cookies.remove('accessToken');
      set({ user: null, isAuthenticated: false, accessToken: null, isLoading: false });
    }
  },

  login: async (username, password) => {
    try {
      const response = await apiService.signin({ username, password });
      const { accessToken } = response.data;
      Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
      const userResponse = await apiService.getUser();
      set({ user: userResponse.data, isAuthenticated: true, accessToken });
      return { success: true };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  register: async (data) => {
    try {
      const response = await apiService.signup(data);
      const { accessToken } = response.data;
      Cookies.set('accessToken', accessToken, { expires: 1 });
      const userResponse = await apiService.getUser();
      set({ user: userResponse.data, isAuthenticated: true, accessToken });
      return { success: true };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 409) return { success: false, message: 'Email already in use' };
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  logout: async () => {
    Cookies.remove('accessToken');
    set({ user: null, isAuthenticated: false, accessToken: null });
  },
}));
