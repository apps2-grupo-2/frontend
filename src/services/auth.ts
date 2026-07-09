import axios from 'axios';

import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
  AuthVerifyAccountRequest,
  UserRole,
} from '@/typings/services/auth';
import type { MockUser } from '@/mocks/auth-mock';
import { ENV, USER_TYPE } from '@/constants';
import { MOCK_USERS, MOCK_USERS_PATIENTS } from '@/mocks/auth-mock';
import { isMockEnabled } from '@/stores/mock.store';

type CoreAuthResponse = {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
};

type CoreRole = { id: number; name: string };
type CoreUser = { id: number; roles?: CoreRole[] };

const resolveRole = (roles: CoreRole[] = []): UserRole => {
  const names = roles.map(r => (r.name ?? '').toLowerCase());
  const has = (...keys: string[]) => names.some(n => keys.some(k => n.includes(k)));
  if (has('admin', 'recep', 'staff', 'administrativo')) return USER_TYPE.ADMINISTRATIVE;
  if (has('medic', 'médic', 'doctor', 'profesional', 'professional')) return USER_TYPE.PROFESSIONAL;
  return USER_TYPE.PATIENT;
};

const ROLE_LABEL: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: 'Paciente',
  [USER_TYPE.PROFESSIONAL]: 'Profesional',
  [USER_TYPE.ADMINISTRATIVE]: 'Administración',
};

const fetchUserRole = async (userId: number, token: string): Promise<UserRole> => {
  try {
    const { data } = await axios.get<CoreUser>(`${ENV.CORE_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resolveRole(data.roles);
  } catch (err) {
    console.warn('ERROR ON: fetchUserRole (se asume rol paciente)', err);
    return USER_TYPE.PATIENT;
  }
};

const mockLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  await new Promise(a => setTimeout(a, 50));
  const user = MOCK_USERS.find(a => a.email === body.identifier && a.password === body.password);
  if (!user) throw new Error('Credenciales incorrectas');
  return {
    id: user.id,
    dni: user.dni,
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
    email: user.email,
    role: user.role,
    name: user.name,
    subtitle: user.subtitle,
    lat: user.lat,
    lng: user.lng,
  };
};

export const DEV_USERS: AuthLoginResponse[] = [
  {
    id: '18',
    dni: '',
    access_token: 'dev-token-paciente',
    refresh_token: 'dev-token-paciente',
    email: 'benjamin.ruiz@mock.com',
    role: USER_TYPE.PATIENT,
    name: 'Benjamín Ruiz',
    subtitle: 'Paciente',
    lat: '-34.607548',
    lng: '-58.426964',
  },
  {
    id: '19',
    dni: '',
    access_token: 'dev-token-profesional',
    refresh_token: 'dev-token-profesional',
    email: 'medico@mock.com',
    role: USER_TYPE.PROFESSIONAL,
    name: 'Dr. Dev Profesional',
    subtitle: 'Profesional',
    lat: '-34.607548',
    lng: '-58.426964',
  },
  {
    id: '20',
    dni: '',
    access_token: 'dev-token-administrativo',
    refresh_token: 'dev-token-administrativo',
    email: 'admin@mock.com',
    role: USER_TYPE.ADMINISTRATIVE,
    name: 'Admin Dev',
    subtitle: 'Administración',
    lat: '-34.607548',
    lng: '-58.426964',
  },
];

const devLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse | null> => {
  await new Promise(a => setTimeout(a, 50));
  const user = DEV_USERS.find(u => u.email === body.identifier && body.password === '1234');
  return user ?? null;
};

export const authLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  if (isMockEnabled()) return mockLogin(body);

  const devUser = await devLogin(body);
  if (devUser) return devUser;

  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/login`, {
      email: body.identifier,
      password: body.password,
    });

    const role = await fetchUserRole(data.user.id, data.token);
    const name = `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim();

    return {
      id: `${data.user.id}`,
      dni: '',
      access_token: data.token,
      refresh_token: data.token,
      email: data.user.email,
      role,
      name,
      subtitle: ROLE_LABEL[role],
      lat: '',
      lng: '',
    };
  } catch (err) {
    console.warn('ERROR ON: authLogin (core)', err);
    throw new Error('Error al iniciar sesión');
  }
};

// El autoregistro crea siempre un PACIENTE. Profesionales/administrativos
// los da de alta un admin (POST /users -> mail de verificacion).
const mockRegister = async (body: AuthRegisterRequest): Promise<AuthLoginResponse> => {
  await new Promise(a => setTimeout(a, 50));
  const exists = MOCK_USERS.some(u => u.email.toLowerCase() === body.email.toLowerCase());
  if (exists) throw new Error('Ya existe una cuenta con ese email');

  const id = `mock-${Date.now()}`;
  const newUser: MockUser = {
    id,
    dni: '',
    password: body.password,
    role: USER_TYPE.PATIENT,
    name: `${body.first_name} ${body.last_name}`.trim(),
    email: body.email,
    subtitle: ROLE_LABEL[USER_TYPE.PATIENT],
    accessToken: `mock-token-${id}`,
    refreshToken: `mock-refresh-${id}`,
    lat: '-34.607548',
    lng: '-58.426964',
  };
  // Persistir en memoria para que pueda volver a loguearse en la sesion.
  MOCK_USERS_PATIENTS.push(newUser);
  MOCK_USERS.push(newUser);

  return {
    id: newUser.id,
    dni: newUser.dni,
    access_token: newUser.accessToken,
    refresh_token: newUser.refreshToken,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
    subtitle: newUser.subtitle,
    lat: newUser.lat,
    lng: newUser.lng,
  };
};

export const authRegister = async (body: AuthRegisterRequest): Promise<AuthLoginResponse> => {
  if (isMockEnabled()) return mockRegister(body);

  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/register`, {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
    });

    const role = USER_TYPE.PATIENT; // register no asigna rol -> paciente por defecto
    const name = `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim();

    return {
      id: `${data.user.id}`,
      dni: '',
      access_token: data.token,
      refresh_token: data.token,
      email: data.user.email,
      role,
      name,
      subtitle: ROLE_LABEL[role],
      lat: '',
      lng: '',
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error('El email ya está registrado o los datos son inválidos');
    }
    console.warn('ERROR ON: authRegister (core)', err);
    throw new Error('No se pudo crear la cuenta');
  }
};

// Paso 1 de recuperar contraseña: el Core envia un codigo al email.
export const requestPasswordReset = async (email: string): Promise<void> => {
  if (isMockEnabled()) {
    await new Promise(a => setTimeout(a, 300));
    return;
  }
  try {
    await axios.post(`${ENV.CORE_BASE_URL}/auth/forgot-password`, { email });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      throw new Error('No existe una cuenta con ese email');
    }
    console.warn('ERROR ON: requestPasswordReset (core)', err);
    throw new Error('No se pudo enviar el código de recuperación');
  }
};

// Paso 2 de recuperar contraseña: validar el codigo y setear la nueva.
export const resetPassword = async (body: AuthResetPasswordRequest): Promise<void> => {
  if (isMockEnabled()) {
    await new Promise(a => setTimeout(a, 300));
    return;
  }
  try {
    await axios.post(`${ENV.CORE_BASE_URL}/auth/reset-password`, body);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 400) {
        throw new Error('El código es inválido o expiró, o la contraseña no cumple los requisitos');
      }
      if (err.response?.status === 404) {
        throw new Error('No existe una cuenta con ese email');
      }
    }
    console.warn('ERROR ON: resetPassword (core)', err);
    throw new Error('No se pudo cambiar la contraseña');
  }
};

// Activa una cuenta creada por un admin: el usuario elige su contraseña
// (token viene del link del email) y queda logueado.
export const verifyAccount = async (body: AuthVerifyAccountRequest): Promise<AuthLoginResponse> => {
  if (isMockEnabled()) {
    await new Promise(a => setTimeout(a, 300));
    return {
      id: `mock-${Date.now()}`,
      dni: '',
      access_token: 'mock-token-verify',
      refresh_token: 'mock-refresh-verify',
      email: 'cuenta.activada@mock.com',
      role: USER_TYPE.PATIENT,
      name: 'Cuenta activada',
      subtitle: ROLE_LABEL[USER_TYPE.PATIENT],
      lat: '-34.607548',
      lng: '-58.426964',
    };
  }
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/verify-account`, {
      token: body.token,
      password: body.password,
    });

    const role = await fetchUserRole(data.user.id, data.token);
    const name = `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim();

    return {
      id: `${data.user.id}`,
      dni: '',
      access_token: data.token,
      refresh_token: data.token,
      email: data.user.email,
      role,
      name,
      subtitle: ROLE_LABEL[role],
      lat: '',
      lng: '',
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error('El enlace es inválido, ya fue usado o expiró');
    }
    console.warn('ERROR ON: verifyAccount (core)', err);
    throw new Error('No se pudo activar la cuenta');
  }
};

// SSO entre módulos de Health Grid: el usuario llega a /auth/sso con un ticket
// efímero (un solo uso, ~60s) emitido por el core. Como el módulo 2 es una SPA
// sin backend de auth propio, el canje se hace desde el navegador contra el
// endpoint público POST /auth/sso-exchange (variante SPA de la guía del core).
// Reutilizamos fetchUserRole para resolver el rol, igual que en el login normal.
export const establishSessionFromTicket = async (ticket: string): Promise<AuthLoginResponse> => {
  if (isMockEnabled()) {
    await new Promise(a => setTimeout(a, 50));
    return DEV_USERS[0];
  }
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/sso-exchange`, { ticket });
    const role = await fetchUserRole(data.user.id, data.token);
    const name = `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim();
    return {
      id: `${data.user.id}`, dni: '', access_token: data.token, refresh_token: data.token,
      email: data.user.email, role, name, subtitle: ROLE_LABEL[role], lat: '', lng: '',
    };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      throw new Error('El enlace de acceso expiró o ya fue usado. Iniciá sesión nuevamente.');
    }
    console.warn('ERROR ON: establishSessionFromTicket (core)', err);
    throw new Error('No se pudo completar el ingreso automático (SSO)');
  }
};
