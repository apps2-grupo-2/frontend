import type { UserRole } from '@/typings/services/auth';

export type AuthStoreStates = {
  accessToken: string | undefined;
  autoLogin: boolean;
  dni: string | undefined;
  email: string | undefined;
  logoutRequired: boolean;
  name: string | undefined;
  refreshToken: string | undefined;
  role: UserRole | undefined;
  subtitle: string | undefined;
};

type AuthStoreActions = {
  logout: () => void;
  resetStore: () => void;
  enableAutoLogin: () => void;
  setAuth: (
    states: Pick<AuthStoreStates, 'accessToken' | 'refreshToken' | 'email' | 'role' | 'name' | 'subtitle' | 'dni'>
  ) => void;
};

export type AuthStore = AuthStoreStates & AuthStoreActions;