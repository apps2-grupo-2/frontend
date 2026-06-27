import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from '@/components/layouts/base-layout';
import { ProtectedRoute } from '@/components/layouts/protected-route';
import { ROUTES, USER_TYPE } from '@/constants';

const LoginPage = lazy(() => import('./pages/login'));
const RegisterPage = lazy(() => import('./pages/register'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password'));
const VerifyAccountPage = lazy(() => import('./pages/verify-account'));
const AppointmentsPage = lazy(() => import('./pages/patient/appointments'));
const AppointmentSchedulePage = lazy(() => import('./pages/patient/appointment-schedule'));
const ProfessionalCalendarPage = lazy(() => import('./pages/professional/professional-calendar'));
const CheckinPage = lazy(() => import('./pages/administrative/checkin'));
const AdminAppointmentCreatePage = lazy(() => import('./pages/administrative/appointment-create'));

export function App() {
  return (
    <Suspense>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.VERIFY_ACCOUNT} element={<VerifyAccountPage />} />

        <Route element={<BaseLayout />}>
          {/* Solo pacientes */}
          <Route
            path={ROUTES.TURNOS}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.PATIENT]}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SOLICITAR_TURNOS}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.PATIENT]}>
                <AppointmentSchedulePage />
              </ProtectedRoute>
            }
          />

          {/* Profesionales */}
          <Route
            path={ROUTES.AGENDA_PROFESIONAL}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.PROFESSIONAL]}>
                <ProfessionalCalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Solo administrativos */}
          <Route
            path={ROUTES.PRESENTISMO}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.ADMINISTRATIVE]}>
                <CheckinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CREAR_TURNO_ADMIN}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.ADMINISTRATIVE]}>
                <AdminAppointmentCreatePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
}