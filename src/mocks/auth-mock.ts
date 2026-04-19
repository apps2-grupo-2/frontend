import { USER_TYPE } from '@/constants';
import type { UserRole } from '@/typings/services/auth';

// TODO: reemplazar con POST /auth/sign-in del módulo Core
// El módulo Core devolverá un JWT con el rol codificado en el payload

export type MockUser = {
  dni: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  subtitle: string; // obra social / especialidad / área
  accessToken: string;
  refreshToken: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    dni: '28345671',
    password: 'patient',
    role: USER_TYPE.PATIENT,
    name: 'González María Elena',
    email: 'maria.gonzalez@email.com',
    subtitle: 'OSDE 310',
    accessToken: 'mock-token-paciente',
    refreshToken: 'mock-refresh-paciente',
  },
  {
    dni: '20987654',
    password: '1234',
    role: USER_TYPE.PROFESSIONAL,
    name: 'Fernandez Juan Pablo',
    email: 'jfernandez@healthgrid.com',
    subtitle: 'Cardiología · Electrofisiología',
    accessToken: 'mock-token-profesional',
    refreshToken: 'mock-refresh-profesional',
  },
  {
    dni: '33112233',
    password: '1234',
    role: USER_TYPE.ADMINISTRATIVE,
    name: 'Sosa Rodrigo',
    email: 'rsosa@healthgrid.com',
    subtitle: 'Administración',
    accessToken: 'mock-token-administrativo',
    refreshToken: 'mock-refresh-administrativo',
  },
];
