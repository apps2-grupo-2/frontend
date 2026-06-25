import type { UserRole } from '@/typings/services/auth';

export type AuthStoreStates = {
  accessToken: string | undefined;
  id: string | undefined;
  dni: string | undefined;
  email: string | undefined;
  name: string | undefined;
  refreshToken: string | undefined;
  role: UserRole | undefined;
  subtitle: string | undefined;
  lat: string;
  lng: string;
};

export type AuthStoreOptionsStates = {
  autoLogin: boolean;
  logoutRequired: boolean;
};

type AuthStoreActions = {
  logout: () => void;
  resetStore: () => void;
  enableAutoLogin: () => void;
  setAuth: (states: AuthStoreStates) => void;
};

export type AuthStore = AuthStoreStates & AuthStoreOptionsStates & AuthStoreActions;