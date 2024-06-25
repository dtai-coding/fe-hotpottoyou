import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const storeApi = (set) => ({
  isRefecth: false,
  refetchApp: () => set((state) => ({ isRefecth: !state.isRefecth })),
});

export const useAppStore = create()(devtools(persist(storeApi, { name: 'app-storage' })));
