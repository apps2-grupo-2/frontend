import { Navigate } from 'react-router-dom';

import type { UserRole } from '@/typings/services/auth';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';

// Ruta de inicio para cada rol — a donde se redirige si el usuario no tiene acceso
const ROLE_HOME: Record<UserRole, string> = {
  paciente: ROUTES.TURNOS,
  profesional: ROUTES.AGENDA_PROFESIONAL,
  administrativo: ROUTES.PRESENTISMO,
};

type ProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { accessToken, role } = useAuthStore();

  // Sin sesión → login
  if (!accessToken || !role) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Sesión válida pero rol sin permiso → home del rol
  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  return <>{children}</>;
};
