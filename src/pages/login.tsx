import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Lock, User } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_GEO, ROUTES, USER_TYPE } from '@/constants';
import { authLogin } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';

const ROLE_HOME: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: ROUTES.TURNOS,
  [USER_TYPE.PROFESSIONAL]: ROUTES.AGENDA_PROFESIONAL,
  [USER_TYPE.ADMINISTRATIVE]: ROUTES.PRESENTISMO,
};

const stats = [
  { value: '48k+', label: 'Pacientes activos' },
  { value: '320+', label: 'Profesionales' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: 'ISO 27001', label: 'Certificación' },
];

const statDelays = ['delay-0', 'delay-75', 'delay-150', 'delay-200'] as const;

const getGeolocation = (): Promise<{ lat: string; lng: string } | null> =>
  new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos =>
        resolve({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }),
      () => resolve(null),
      { timeout: 10000 }
    );
  });

const resolveLocation = (loc: { lat: string; lng: string } | null) => loc ?? DEFAULT_GEO;

export default function Page() {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Ingresá tu email y contraseña para continuar.');
      return;
    }
    doLogin(email, password);
  };

  const doLogin = async (identifier: string, pass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await authLogin({ identifier, password: pass });
      const location = resolveLocation(await getGeolocation());
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
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
            Tu salud, en la palma de tu mano.
          </p>
          <p className="text-sm leading-relaxed text-sidebar-foreground/60">
            Accedé a tus turnos, resultados de laboratorio, recetas y teleconsultas médicas desde un solo portal seguro
            y unificado.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className={`animate-in duration-300 fill-mode-both fade-in ${statDelays[i]} rounded-xl bg-sidebar-accent p-4`}
              >
                <p className="font-heading text-xl font-bold text-sidebar-foreground">{value}</p>
                <p className="mt-0.5 text-xs text-sidebar-foreground/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sidebar-foreground/30">© 2026 Health Grid · HIPAA Compliant · Ley 25.326</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">Health Grid</span>
        </div>

        <Card className="w-full max-w-md animate-in border-border shadow-none duration-300 fill-mode-both fade-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            <div className="mb-5">
              <h1 className="font-heading text-2xl font-bold text-foreground">Iniciar sesión</h1>
              <p className="mt-1 text-sm text-muted-foreground">Accedé al portal con tu email.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  Email
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Ingresá tu email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-input bg-background py-3 pr-10 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
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

              {error && (
                <p className="animate-in rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive duration-200 fill-mode-both fade-in">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-secondary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Ingresando...
                  </span>
                ) : (
                  'Ingresar al portal'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                className="text-sm text-accent underline-offset-4 transition-all hover:text-accent/80 hover:underline active:scale-[0.97]"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate(ROUTES.REGISTER)}
                className="font-medium text-accent underline-offset-4 transition-all hover:text-accent/80 hover:underline active:scale-[0.97]"
              >
                Registrate
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}