import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, Lock, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { value: '48k+', label: 'Pacientes activos' },
  { value: '320+', label: 'Profesionales' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: 'ISO 27001', label: 'Certificación' },
];

const statDelays = ['delay-0', 'delay-75', 'delay-150', 'delay-200'] as const;

export default function Page() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim() || !password.trim()) {
      setError('Ingresá tu DNI y contraseña para continuar.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/mi-salud');
    }, 1200);
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
                className={`animate-in fade-in fill-mode-both duration-300 ${statDelays[i]} rounded-xl bg-sidebar-accent p-4`}
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

        <Card className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-300 w-full max-w-md border-border shadow-none">
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="font-heading text-2xl font-bold text-foreground">Iniciar sesión</h1>
              <p className="mt-1 text-sm text-muted-foreground">Accedé al Portal del Paciente con tu DNI.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="dni"
                  className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  DNI / CUIL
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
                  <input
                    id="dni"
                    type="text"
                    className="w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="28345671"
                    value={dni}
                    onChange={e => setDni(e.target.value.replace(/\D/g, ''))}
                    autoComplete="username"
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
                    placeholder="••••••••"
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
                <p className="animate-in fade-in fill-mode-both duration-200 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
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

              <div className="text-center">
                <button type="button" className="text-sm text-accent transition-colors hover:text-accent/80">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-center text-xs text-muted-foreground">
                ¿Primera vez? Registrate con tu número de afiliado en la recepción o
                <button className="ml-1 text-accent transition-colors hover:underline">solicitá acceso online</button>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
