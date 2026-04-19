import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from '@/components/layouts/base-layout';
import { ProtectedRoute } from '@/components/layouts/protected-route';
import { ROUTES, USER_TYPE } from '@/constants';

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
              <ProtectedRoute allowedRoles={[USER_TYPE.PATIENT]}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SOLICITAR_TURNOS}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.PATIENT]}>
                <AppointmentRequestPage />
              </ProtectedRoute>
            }
          />

          {/* Profesionales y administrativos */}
          <Route
            path={ROUTES.AGENDA_PROFESIONAL}
            element={
              <ProtectedRoute allowedRoles={[USER_TYPE.PROFESSIONAL, USER_TYPE.ADMINISTRATIVE]}>
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
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
}
