import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { AuthStore, AuthStoreStates } from '@/typings/stores/auth';

const defaultFields: AuthStoreStates = {
  autoLogin: false,
  accessToken: undefined,
  email: undefined,
  logoutRequired: false,
  refreshToken: undefined,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...defaultFields,
      logout: () => set({ logoutRequired: true }),
      enableAutoLogin: () => set({ autoLogin: true }),
      resetStore: () => set(defaultFields),
      setTokens: a =>
        set({
          accessToken: a.accessToken,
          email: a.email,
          refreshToken: a.refreshToken,
        }),
    }),
    {
      name: 'auth', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
