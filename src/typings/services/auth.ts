import type { USER_TYPE } from '@/constants';

export type UserRole = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export type AuthLoginRequest = {
  identifier: string; // DNI
  password: string;
};

export type AuthRegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type AuthForgotPasswordRequest = {
  email: string;
};

export type AuthResetPasswordRequest = {
  email: string;
  code: string;
  new_password: string;
};

export type AuthVerifyAccountRequest = {
  token: string;
  password: string;
};

// Canje de ticket SSO del core: el navegador entrega el ticket efímero
// (un solo uso, ~60s) y el core devuelve { user, token } (JWT).
export type AuthSsoExchangeRequest = {
  ticket: string;
};

export type AuthLoginResponse = {
  id: string;
  dni: string;
  access_token: string;
  refresh_token: string;
  email: string;
  role: UserRole;
  name: string;
  subtitle: string; // obra social / especialidad / área
  lat: string;
  lng: string;
};