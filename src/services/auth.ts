import axios from 'axios';

import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
  AuthVerifyAccountRequest,
  UserRole,
} from '@/typings/services/auth';
import { ENV, USER_TYPE } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';

// Respuesta del core al emitir un ticket de SSO (POST /auth/sso-ticket).
type SSOTicketResponse = { ticket: string; expires_in: number };

type CoreRole = { id: number; name: string };
type CoreUser = { id: number; roles?: CoreRole[] };

// El login/registro/verify/sso-exchange devuelven AuthResponse = { token, user }.
// El user YA trae roles[] (según el swagger del core), así que resolvemos el rol
// desde acá y evitamos el GET /users/{id} aparte, que está gateado por el permiso
// users:read (los pacientes/médicos vienen con permissions vacío y les daría 403).
type CoreAuthResponse = {
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles?: CoreRole[];
  };
};

// Ids de rol del core (Francisco, 13/07/2026): el backend de turnos valida
// medico = rol id 2 y paciente = rol id 10. Los usamos como señal primaria y
// caemos al match por nombre si el core devolviera otros ids.
const ROLE_ID = { PROFESSIONAL: 2, PATIENT: 10 } as const;

const resolveRole = (roles: CoreRole[] = []): UserRole => {
  const ids = roles.map(r => r.id);
  const names = roles.map(r => (r.name ?? '').toLowerCase());
  const has = (...keys: string[]) => names.some(n => keys.some(k => n.includes(k)));
  if (has('admin', 'recep', 'staff', 'administrativo')) return USER_TYPE.ADMINISTRATIVE;
  if (ids.includes(ROLE_ID.PROFESSIONAL) || has('medic', 'médic', 'doctor', 'profesional', 'professional'))
    return USER_TYPE.PROFESSIONAL;
  return USER_TYPE.PATIENT;
};

const ROLE_LABEL: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: 'Paciente',
  [USER_TYPE.PROFESSIONAL]: 'Profesional',
  [USER_TYPE.ADMINISTRATIVE]: 'Administración',
};

// Fallback: si por lo que sea el login no trajo roles, intentamos el GET
// /users/{id} (best-effort; requiere users:read, así que suele fallar para
// usuarios no-admin y cae a paciente).
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

// Resuelve el rol priorizando los roles que ya vienen en la respuesta de auth;
// sólo si no vinieran, cae al GET /users/{id}.
const resolveRoleFromAuth = async (user: CoreAuthResponse['user'], token: string): Promise<UserRole> => {
  if (user.roles && user.roles.length > 0) return resolveRole(user.roles);
  return fetchUserRole(user.id, token);
};

export const authLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.BASE_URL}/auth/login`, {
      email: body.identifier,
      password: body.password,
    });

    const role = await resolveRoleFromAuth(data.user, data.token);
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
export const authRegister = async (body: AuthRegisterRequest): Promise<AuthLoginResponse> => {
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.BASE_URL}/auth/register`, {
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
// No revelamos si el email existe o no (evita enumeración de usuarios): ante 404
// resolvemos igual, como si el código se hubiera enviado.
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await axios.post(`${ENV.BASE_URL}/auth/forgot-password`, { email });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return;
    }
    console.warn('ERROR ON: requestPasswordReset (core)', err);
    throw new Error('No se pudo enviar el código de recuperación');
  }
};

// Paso 2 de recuperar contraseña: validar el codigo y setear la nueva.
export const resetPassword = async (body: AuthResetPasswordRequest): Promise<void> => {
  try {
    await axios.post(`${ENV.CORE_BASE_URL}/auth/reset-password`, body);
  } catch (err) {
    if (axios.isAxiosError(err) && (err.response?.status === 400 || err.response?.status === 404)) {
      throw new Error('El código es inválido o expiró, o la contraseña no cumple los requisitos');
    }
    console.warn('ERROR ON: resetPassword (core)', err);
    throw new Error('No se pudo cambiar la contraseña');
  }
};

// Activa una cuenta creada por un admin: el usuario elige su contraseña
// (token viene del link del email) y queda logueado.
export const verifyAccount = async (body: AuthVerifyAccountRequest): Promise<AuthLoginResponse> => {
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/verify-account`, {
      token: body.token,
      password: body.password,
    });

    const role = await resolveRoleFromAuth(data.user, data.token);
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
// efímero (un solo uso, ~60s) emitido por el core. Como el módulo 2 es una SPA,
// el canje se hace desde el navegador contra el endpoint público
// POST /auth/sso-exchange (variante SPA de la guía del core).
export const establishSessionFromTicket = async (ticket: string): Promise<AuthLoginResponse> => {
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/sso-exchange`, { ticket });
    const role = await resolveRoleFromAuth(data.user, data.token);
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
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      throw new Error('El enlace de acceso expiró o ya fue usado. Iniciá sesión nuevamente.');
    }
    console.warn('ERROR ON: establishSessionFromTicket (core)', err);
    throw new Error('No se pudo completar el ingreso automático (SSO)');
  }
};

// Lado EMISOR del SSO. Pide al core un ticket efímero (un solo uso, vive
// segundos) para el usuario ya logueado, para poder redirigirlo YA autenticado
// a otro módulo (que lo canjea en su backend vía /auth/sso-exchange).
// POST {CORE}/auth/sso-ticket con el JWT del usuario -> { ticket, expires_in }.
// Devuelve null si no hay sesión o si el core falla (el sidebar cae entonces al
// redirect directo sin SSO).
export const requestSsoTicket = async (): Promise<string | null> => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return null;

  try {
    const { data } = await axios.post<SSOTicketResponse>(
      `${ENV.CORE_BASE_URL}/auth/sso-ticket`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return data.ticket ?? null;
  } catch (err) {
    console.warn('ERROR ON: requestSsoTicket (core)', err);
    return null;
  }
};