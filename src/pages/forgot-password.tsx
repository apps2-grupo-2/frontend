import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, AtSign, CheckCircle2, KeyRound, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { requestPasswordReset, resetPassword } from '@/services/auth';

type Step = 'request' | 'reset' | 'done';

const inputClass =
  'w-full rounded-lg border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground transition-[border-color,box-shadow] outline-none focus:border-primary focus:ring-3 focus:ring-primary/20';
const labelClass = 'mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase';

export default function Page() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Ingresá tu email para continuar.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim() || !password) {
      setError('Ingresá el código y tu nueva contraseña.');
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
      await resetPassword({ email: email.trim(), code: code.trim(), new_password: password });
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.');
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
            Recuperá el acceso a tu cuenta.
          </p>
          <p className="text-sm leading-relaxed text-sidebar-foreground/60">
            Te enviamos un código a tu email para que puedas elegir una nueva contraseña de forma segura.
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
            {step === 'done' ? (
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Contraseña actualizada</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ya podés ingresar al portal con tu nueva contraseña.
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
                  <h1 className="font-heading text-2xl font-bold text-foreground">Recuperar contraseña</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step === 'request'
                      ? 'Ingresá tu email y te enviamos un código.'
                      : `Ingresá el código que enviamos a ${email} y tu nueva contraseña.`}
                  </p>
                </div>

                {step === 'request' ? (
                  <form onSubmit={handleRequest} className="space-y-5">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <div className="relative">
                        <AtSign className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="email"
                          type="email"
                          className={inputClass}
                          placeholder="tu@email.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
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
                      {loading ? 'Enviando...' : 'Enviar código'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleReset} className="space-y-5">
                    <div>
                      <label htmlFor="code" className={labelClass}>
                        Código
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="code"
                          type="text"
                          className={inputClass}
                          placeholder="Código recibido por email"
                          value={code}
                          onChange={e => setCode(e.target.value)}
                          autoComplete="one-time-code"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className={labelClass}>
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type="password"
                          className={inputClass}
                          placeholder="Mínimo 6 caracteres"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
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
                          type="password"
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
                      {loading ? 'Guardando...' : 'Cambiar contraseña'}
                    </Button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 transition-all hover:text-accent/80 hover:underline active:scale-[0.97]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a iniciar sesión
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
