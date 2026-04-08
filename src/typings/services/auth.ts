export type AuthLoginRequest = {
  identifier: string;
  password: string;
};

export type AuthLoginResponse = {
  access_token: string;
  refresh_token: string;
  email: string;
};
