import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

import { loginAPI, registerAPI, getUserByEmailAPI } from 'src/api/apis';

const storeApi = (set) => ({
  auth: {
    status: 'unauthorized',
    accessToken: undefined,
    refreshToken: undefined,
    user: undefined,
  },
  loginUser: async (payload) => {
    try {
      console.log('Sending login request with payload:', payload);
      const response = await loginAPI(payload);

      if (!response || !response.value) {
        throw new Error('Invalid login response');
      }

      const accessToken = response; // Ensure response.value contains the accessToken
      const refreshToken = response.value || 'dummyRefreshToken'; // Adjust as necessary

      const userResponse = await getUserByEmailAPI(payload.email);
      if (!userResponse || !userResponse.value) {
        throw new Error('Invalid user details response');
      }

      const userInfo = {
        email: payload.email,
        ...userResponse.value,
      };

      set({ auth: { status: 'authorized', accessToken, refreshToken, user: userInfo } });
    } catch (error) {
      console.error('Login error:', error);
      set({ auth: { status: 'unauthorized', accessToken: undefined, refreshToken: undefined, user: undefined } });
      console.log('Credential incorrect:', error);
    }
  },
  logoutUser: () => {
    set({ auth: { status: 'unauthorized', accessToken: undefined, refreshToken: undefined, user: undefined } });
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
