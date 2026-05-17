import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthStore, AuthStoreOptionsStates, AuthStoreStates } from '@/typings/stores/auth';

const defaultFields: AuthStoreStates & AuthStoreOptionsStates = {
  accessToken: undefined,
  autoLogin: false,
  dni: undefined,
  email: undefined,
  id: undefined,
  logoutRequired: false,
  name: undefined,
  refreshToken: undefined,
  role: undefined,
  subtitle: undefined,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      ...defaultFields,
      logout: () => set({ logoutRequired: true }),
      enableAutoLogin: () => set({ autoLogin: true }),
      resetStore: () => set(defaultFields),
      setAuth: a => set(a),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);