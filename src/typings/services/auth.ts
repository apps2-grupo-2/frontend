import type { USER_TYPE } from '@/constants';

export type UserRole = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export type AuthLoginRequest = {
  identifier: string; // DNI
  password: string;
};

export type AuthLoginResponse = {
  access_token: string;
  refresh_token: string;
  email: string;
  role: UserRole;
  name: string;
  subtitle: string; // obra social / especialidad / área
};
