import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ClipboardList, Eye, EyeOff, Lock, Stethoscope, User } from 'lucide-react';

import type { UserRole } from '@/typings/services/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES, USER_TYPE } from '@/constants';
import { cn } from '@/lib/utils';
import { MOCK_USERS } from '@/mocks/auth-mock';
import { authLogin } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';
import { useMockStore } from '@/stores/mock.store';

const ROLE_HOME: Record<UserRole, string> = {
  [USER_TYPE.PATIENT]: ROUTES.TURNOS,
  [USER_TYPE.PROFESSIONAL]: ROUTES.AGENDA_PROFESIONAL,
  [USER_TYPE.ADMINISTRATIVE]: ROUTES.PRESENTISMO,
};

const ROLE_QUICK_ACCESS = [
  { role: USER_TYPE.PATIENT, label: 'Paciente', icon: User, color: 'text-primary' },
  { role: USER_TYPE.PROFESSIONAL, label: 'Profesional', icon: Stethoscope, color: 'text-success' },
  { role: USER_TYPE.ADMINISTRATIVE, label: 'Administrativo', icon: ClipboardList, color: 'text-amber-600' },
];

const stats = [
  { value: '48k+', label: 'Pacientes activos' },
  { value: '320+', label: 'Profesionales' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: 'ISO 27001', label: 'Certificación' },
];

const statDelays = ['delay-0', 'delay-75', 'delay-150', 'delay-200'] as const;

// Genera una coordenada random (string) dentro de un rango.
const randomCoordinate = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(4);

export default function Page() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const mockEnabled = useMockStore(s => s.enabled);
  const toggleMock = useMockStore(s => s.toggle);

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
      authStore.setAuth({
        id: res.id,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        email: res.email,
        role: res.role,
        name: res.name,
        subtitle: res.subtitle,
        dni: res.dni,
        // Se genera una lat/lng random en cada login (CABA aprox.)
        lat: randomCoordinate(-34.705, -34.527),
        lng: randomCoordinate(-58.531, -58.335),
      });
      navigate(ROLE_HOME[res.role], { replace: true });
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccess = (role: UserRole) => {
    let user: (typeof MOCK_USERS)[0];
    if (role === USER_TYPE.PATIENT) {
      user = MOCK_USERS.find(u => u.role === USER_TYPE.PATIENT && u.id === '4')!;
    } else {
      user = MOCK_USERS.find(u => u.role === role)!;
    }
    setEmail(user.email);
    setPassword(user.password);
    doLogin(user.email, user.password);
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
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">Health Grid</span>
        </div>

        <Card className="w-full max-w-md animate-in border-border shadow-none duration-300 fill-mode-both fade-in slide-in-from-bottom-4">
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="font-heading text-2xl font-bold text-foreground">Iniciar sesión</h1>
              <p className="mt-1 text-sm text-muted-foreground">Accedé al portal con tu email.</p>
            </div>

            {/* Acceso rápido (solo en entorno de desarrollo/mock) */}
            <div className="mb-6 rounded-lg border border-dashed border-border bg-muted/30 p-4">
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Acceso rápido · Demo
              </p>
              <div className="flex gap-2">
                {ROLE_QUICK_ACCESS.map(({ role, label, icon: Icon, color }) => (
                  <button
                    key={role}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickAccess(role)}
                    className="flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-3 text-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm active:scale-[0.97] active:bg-primary/10 disabled:opacity-50"
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="font-medium text-foreground">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle modo mock (turnos/pacientes en memoria, sin backend) */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Modo mock</p>
                <p className="text-xs text-muted-foreground">
                  {mockEnabled ? 'Turnos y pacientes en memoria' : 'Usando el backend real'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={mockEnabled}
                aria-label="Activar o desactivar el modo mock"
                onClick={toggleMock}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                  mockEnabled ? 'bg-primary' : 'bg-input'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform',
                    mockEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">o ingresá con tus credenciales</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                className="h-12 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-secondary"
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
                  className="text-sm text-accent underline-offset-4 transition-all hover:text-accent/80 hover:underline active:scale-[0.97]"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}