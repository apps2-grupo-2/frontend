import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES, USER_TYPE } from '@/constants';
import { MOCK_LATITUDES } from '@/mocks/auth-mock';
import { verifyAccount } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';

const ROLE_HOME: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: ROUTES.TURNOS,
  [USER_TYPE.PROFESSIONAL]: ROUTES.AGENDA_PROFESIONAL,
  [USER_TYPE.ADMINISTRATIVE]: ROUTES.PRESENTISMO,
};

const inputClass =
  'w-full rounded-lg border border-input bg-background py-3 pr-10 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20';
const labelClass = 'mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase';

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

export default function Page() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Elegí una contraseña para activar tu cuenta.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const res = await verifyAccount({ token, password });
      const autoLocation = await getGeolocation();
      const location = getMockLocation(autoLocation);
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
      navigate(ROLE_HOME[res.role], { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo activar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="hidden w-2/5 flex-col justify-between bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-heading text-2xl font-bold text-sidebar-foreground">Health Grid</span>
        </div>

        <div className="space-y-6">
          <p className="font-heading text-4xl leading-tight font-bold text-balance text-sidebar-foreground">
            Activá tu cuenta y empezá a trabajar.
          </p>
          <p className="text-sm leading-relaxed text-sidebar-foreground/60">
            Tu cuenta fue creada por el equipo administrativo. Elegí una contraseña para terminar de activarla.
          </p>
        </div>

        <p className="text-xs text-sidebar-foreground/30">© 2026 Health Grid · HIPAA Compliant · Ley 25.326</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">Health Grid</span>
        </div>

        <Card className="w-full max-w-md animate-in border-border shadow-none duration-300 fill-mode-both fade-in slide-in-from-bottom-4">
          <CardContent className="p-8">
            {!token ? (
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Enlace inválido</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  El enlace de activación no es válido o está incompleto. Pedile al administrador que te reenvíe el
                  email de activación.
                </p>
                <Button
                  type="button"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="mt-6 h-12 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-secondary"
                >
                  Ir a iniciar sesión
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-heading text-2xl font-bold text-foreground">Activar cuenta</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Elegí una contraseña para tu cuenta.</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={inputClass}
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Repetir contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={inputClass}
                        placeholder="Repetí tu contraseña"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="animate-in rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive duration-200 fill-mode-both fade-in">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="h-12 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-secondary"
                    disabled={loading}
                  >
                    {loading ? 'Activando...' : 'Activar cuenta'}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}