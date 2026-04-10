import type { UserRole } from '@/typings/services/auth';

export type AuthStoreStates = {
  accessToken: string | undefined;
  autoLogin: boolean;
  email: string | undefined;
  logoutRequired: boolean;
  refreshToken: string | undefined;
  role: UserRole | undefined;
  name: string | undefined;
  subtitle: string | undefined;
};

type AuthStoreActions = {
  logout: () => void;
  resetStore: () => void;
  enableAutoLogin: () => void;
  setTokens: (states: Pick<AuthStoreStates, 'accessToken' | 'refreshToken' | 'email' | 'role' | 'name' | 'subtitle'>) => void;
};

export type AuthStore = AuthStoreStates & AuthStoreActions;
