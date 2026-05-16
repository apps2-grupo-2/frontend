import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthStore, AuthStoreStates } from '@/typings/stores/auth';

const defaultFields: AuthStoreStates = {
  autoLogin: false,
  accessToken: undefined,
  email: undefined,
  logoutRequired: false,
  refreshToken: undefined,
  role: undefined,
  name: undefined,
  subtitle: undefined,
  dni: undefined,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...defaultFields,
      logout: () => set({ logoutRequired: true }),
      enableAutoLogin: () => set({ autoLogin: true }),
      resetStore: () => set(defaultFields),
      setAuth: a =>
        set({
          accessToken: a.accessToken,
          email: a.email,
          refreshToken: a.refreshToken,
          role: a.role,
          name: a.name,
          subtitle: a.subtitle,
          dni: a.dni,
        }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);