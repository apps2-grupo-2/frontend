export type AuthStoreStates = {
  accessToken: string | undefined;
  autoLogin: boolean;
  email: string | undefined;
  logoutRequired: boolean;
  refreshToken: string | undefined;
};

type AuthStoreActions = {
  logout: () => void;
  resetStore: () => void;
  enableAutoLogin: () => void;
  setTokens: (states: Pick<AuthStoreStates, 'accessToken' | 'refreshToken' | 'email'>) => void;
};

export type AuthStore = AuthStoreStates & AuthStoreActions;
