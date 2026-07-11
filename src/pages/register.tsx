import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AtSign, Eye, EyeOff, Lock, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import { MOCK_LATITUDES } from '@/mocks/auth-mock';
import { authRegister } from '@/services/auth';
import { useAuthStore } from '@/stores/auth.store';
import { useMockStore } from '@/stores/mock.store';

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

const getMockLocation = (loc: { lat: string; lng: string } | null) => {
  if (loc) return loc;
  return MOCK_LATITUDES[Math.floor(Math.random() * MOCK_LATITUDES.length)];
};

export default function Page() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const mockEnabled = useMockStore(s => s.enabled);
  const toggleMock = useMockStore(s => s.toggle);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Completá todos los campos para continuar.');
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
      const res = await authRegister({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      });
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
      // Autoregistro = paciente -> va al listado de turnos.
      navigate(ROUTES.TURNOS, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta.');
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
            Creá tu cuenta y empezá a gestionar tu salud.
          </p>
          <p className="text-sm leading-relaxed text-sidebar-foreground/60">
            Reservá turnos, accedé a tus resultados y a tu historia clínica desde un solo portal seguro y unificado.
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
              <h1 className="font-heading text-2xl font-bold text-foreground">Crear cuenta</h1>
              <p className="mt-1 text-sm text-muted-foreground">Registrate como paciente para reservar turnos.</p>
            </div>

            {/* Toggle modo mock (turnos/pacientes en memoria, sin backend) */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Modo mock</p>
                <p className="text-xs text-muted-foreground">
                  {mockEnabled ? 'Cuenta en memoria, sin backend' : 'Usando el backend real'}
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

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                  >
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="firstName"
                      type="text"
                      className="w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                      placeholder="Nombre"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  Email
                </label>
                <div className="relative">
                  <AtSign className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="tu@email.com"
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
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-input bg-background py-3 pr-10 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
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
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  Repetir contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
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
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Creando cuenta...
                  </span>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="font-medium text-accent underline-offset-4 transition-all hover:text-accent/80 hover:underline active:scale-[0.97]"
              >
                Iniciá sesión
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}