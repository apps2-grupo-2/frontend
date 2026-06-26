import axios from 'axios';

import type { AuthLoginRequest, AuthLoginResponse, UserRole } from '@/typings/services/auth';
import { ENV, USER_TYPE } from '@/constants';
import { MOCK_USERS } from '@/mocks/auth-mock';
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
