import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES, USER_TYPE } from '@/constants';
import { MOCK_LATITUDES } from '@/mocks/auth-mock';
import { establishSessionFromTicket } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';

const ROLE_HOME: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: ROUTES.TURNOS,
  [USER_TYPE.PROFESSIONAL]: ROUTES.AGENDA_PROFESIONAL,
  [USER_TYPE.ADMINISTRATIVE]: ROUTES.PRESENTISMO,
};

const getGeolocation = (): Promise<{ lat: string; lng: string } | null> =>
  new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }),
      () => resolve(null),
      { timeout: 10000 }
    );
  });

const getMockLocation = (loc: { lat: string; lng: string } | null) =>
  loc ?? MOCK_LATITUDES[Math.floor(Math.random() * MOCK_LATITUDES.length)];

/**
 * Sólo se permiten rutas internas absolutas (`/algo`). Se descartan URLs
 * externas o `//host` para evitar open redirect (checklist de la guía del core).
 */
const safeRedirect = (path: string | null): string | null => {
  if (!path) return null;
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null;
  return path;
};

/**
 * Lee el ticket tanto de la query (`?ticket=`) como del fragment (`#ticket=`),
 * junto con un redirect interno opcional.
 */
const readSsoParams = (): { ticket: string | null; redirect: string | null } => {
  const query = new URLSearchParams(window.location.search);
  const fragment = window.location.hash ? new URLSearchParams(window.location.hash.slice(1)) : null;
  return {
    ticket: fragment?.get('ticket') ?? query.get('ticket'),
    redirect: fragment?.get('redirect') ?? query.get('redirect'),
  };
};

/**
 * Callback de SSO (`/auth/sso`). El usuario aterriza acá desde otro módulo con un
 * ticket efímero; lo canjeamos apenas monta la ruta, dejamos la sesión propia y
 * navegamos al destino con `replace` (el ticket no queda en el historial).
 */
export default function Page() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [error, setError] = useState('');
  // El ticket es de un solo uso: evitamos canjearlo dos veces (StrictMode).
  const exchangedRef = useRef(false);

  useEffect(() => {
    if (exchangedRef.current) return;
    exchangedRef.current = true;

    const { ticket, redirect } = readSsoParams();

    if (!ticket) {
      setError('El enlace de acceso no incluye un ticket SSO.');
      return;
    }

    void (async () => {
      try {
        const res = await establishSessionFromTicket(ticket);
        const location = getMockLocation(await getGeolocation());
        authStore.setAuth({
          id: res.id,
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          email: res.email,
          role: res.role,
          name: res.name,
          subtitle: res.subtitle,
          dni: res.dni,
          lat: location.lat,
          lng: location.lng,
        });
        const target = safeRedirect(redirect) ?? ROLE_HOME[res.role];
        // replace: el ticket no queda en el historial de navegación.
        navigate(target, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo completar el ingreso automático (SSO).');
      }
    })();
    // Sólo en el montaje inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md animate-in border-border shadow-none duration-300 fill-mode-both fade-in slide-in-from-bottom-4">
        <CardContent className="p-8">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">Health Grid</span>
          </div>

          {error ? (
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">No pudimos ingresarte</h1>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
                className="mt-6 h-12 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-secondary"
              >
                Ir a iniciar sesión
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <h1 className="mt-4 font-heading text-xl font-bold text-foreground">Ingresando…</h1>
              <p className="mt-1 text-sm text-muted-foreground">Verificando tu acceso, un momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}