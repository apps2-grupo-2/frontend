import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BaseLayout } from '@/components/layouts/base-layout';
import { ROUTES } from '@/constants';

const LoginPage = lazy(() => import('./pages/login'));
const AppointmentsPage = lazy(() => import('./pages/appointments'));
const AppointmentRequestPage = lazy(() => import('./pages/appointment-request'));

export function App() {
  return (
    <Suspense>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<BaseLayout />}>
          <Route path={ROUTES.TURNOS} element={<AppointmentsPage />} />
          <Route path={ROUTES.SOLICITAR_TURNOS} element={<AppointmentRequestPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.TURNOS} replace />} />
      </Routes>
    </Suspense>
  );
}
