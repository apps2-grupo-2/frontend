import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from '@/components/layouts/base-layout';
import { ProtectedRoute } from '@/components/layouts/protected-route';
import { ROUTES } from '@/constants';

const LoginPage = lazy(() => import('./pages/login'));
const AppointmentsPage = lazy(() => import('./pages/appointments'));
const AppointmentRequestPage = lazy(() => import('./pages/appointment-request'));
const ProfessionalCalendarPage = lazy(() => import('./pages/professional-calendar'));
const CheckinPage = lazy(() => import('./pages/checkin'));

export function App() {
  return (
    <Suspense>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<BaseLayout />}>
          {/* Solo pacientes */}
          <Route
            path={ROUTES.TURNOS}
            element={
              <ProtectedRoute allowedRoles={['paciente']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SOLICITAR_TURNOS}
            element={
              <ProtectedRoute allowedRoles={['paciente']}>
                <AppointmentRequestPage />
              </ProtectedRoute>
            }
          />

          {/* Profesionales y administrativos */}
          <Route
            path={ROUTES.AGENDA_PROFESIONAL}
            element={
              <ProtectedRoute allowedRoles={['profesional', 'administrativo']}>
                <ProfessionalCalendarPage />
              </ProtectedRoute>
            }
          />

          {/* Solo administrativos */}
          <Route
            path={ROUTES.PRESENTISMO}
            element={
              <ProtectedRoute allowedRoles={['administrativo']}>
                <CheckinPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
}
