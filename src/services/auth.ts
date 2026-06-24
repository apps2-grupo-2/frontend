import axios from 'axios';

import type { AuthLoginRequest, AuthLoginResponse, UserRole } from '@/typings/services/auth';
import { ENV, USER_TYPE } from '@/constants';
import { MOCK_USERS } from '@/mocks/auth-mock';
import { isMockEnabled } from '@/stores/mock.store';

// ─── Tipos de la respuesta del Core (módulo 10) ──────────────────────────────
// Doc: SwaggerHub uade-0e3/core. Login por email + contraseña.
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

// El Core devuelve roles con nombre libre; los mapeamos a los 3 roles del front.
// Tolerante a variantes (es/en, singular/plural). Default: paciente.
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

// El login del Core no devuelve el rol; lo obtenemos consultando el usuario.
// Best-effort: si falla, no bloqueamos el login (queda como paciente).
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

export const authLogin = async (body: AuthLoginRequest): Promise<AuthLoginResponse> => {
  if (isMockEnabled()) return mockLogin(body);

  // ─── Modo real: autenticación contra el Core (módulo 10) ───────────────────
  try {
    const { data } = await axios.post<CoreAuthResponse>(`${ENV.CORE_BASE_URL}/auth/login`, {
      email: body.identifier, // el form del login envía el email como "identifier"
      password: body.password,
    });

    const role = await fetchUserRole(data.user.id, data.token);
    const name = `${data.user.first_name ?? ''} ${data.user.last_name ?? ''}`.trim();

    return {
      id: `${data.user.id}`,
      dni: '', // el Core no maneja DNI (login por email)
      access_token: data.token,
      // El Core no devuelve refresh en el login (existe /auth/refresh aparte).
      // Reutilizamos el token para que el interceptor de axios tenga algo válido.
      refresh_token: data.token,
      email: data.user.email,
      role,
      name,
      subtitle: ROLE_LABEL[role],
      // lat/lng las resuelve el navegador en la pantalla de login (geolocalización).
      lat: '',
      lng: '',
    };
  } catch (err) {
    console.warn('ERROR ON: authLogin (core)', err);
    throw new Error('Error al iniciar sesión');
  }
};
