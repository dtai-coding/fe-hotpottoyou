import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

import { loginAPI, registerAPI } from 'src/api/apis';

const storeApi = (set) => ({
  status: 'unauthorized',
  accessToken: undefined,
  refreshToken: undefined,
  user: undefined,
  loginUser: async (payload) => {
    try {
      const response = await loginAPI(payload);
      const { value } = response;

      // Log the entire response for debugging
      console.log('Login response data:', response);

      if (value) {
        // Assuming the value contains the access token
        const accessToken = value; // Use the token directly if that's what it represents
        // Dummy values for refreshToken and userInfo as the actual response does not contain these
        const refreshToken = 'dummyRefreshToken';
        const userInfo = { email: payload.email }; // Dummy userInfo

        set({ status: 'authorized', accessToken, refreshToken, user: userInfo });
        console.log('User logged in successfully:', response);
      } else {
        console.error('Login response does not contain expected properties:', response);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login failed with response error:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Login failed with request error:', error.request);
      } else {
        console.error('Login error:', error.message);
      }

      set({
        status: 'unauthorized',
        accessToken: undefined,
        refreshToken: undefined,
        user: undefined,
      });
      console.log('Credenciales incorrectas');
    }
  },
  logoutUser: () => {
    set({
      status: 'unauthorized',
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
    });
  },
  registerUser: async (payload) => {
    try {
      await registerAPI(payload);
    } catch (error) {
      throw new Error(`${error}`);
    }
  },
});

export const useAuthStore = create()(devtools(persist(storeApi, { name: 'auth-storage' })));
