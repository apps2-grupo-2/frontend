import { useState } from 'react';
import { Search, Clock, User, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_TODAY_APPOINTMENTS, type CheckinAppointment } from '@/mocks/checkin-mock';
import { cn } from '@/lib/utils';

const statusConfig: Record<CheckinAppointment['status'], { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-700' },
  arrived: { label: 'Llegó', className: 'bg-primary/10 text-primary' },
  'in-progress': { label: 'En atención', className: 'bg-success/10 text-success' },
  completed: { label: 'Finalizado', className: 'bg-muted text-muted-foreground' },
};

export default function Page() {
  const [search, setSearch] = useState('');
  // Estado local para simular el registro de llegada sin backend
  // TODO: reemplazar con PATCH /appointments/:id/checkin (endpoint propio del módulo)
  // El evento de llegada también dispara notificación asincrónica al módulo de internación/sala de espera
  const [appointments, setAppointments] = useState<CheckinAppointment[]>(MOCK_TODAY_APPOINTMENTS);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const handleCheckin = async (id: string) => {
    setCheckingInId(id);
    // Simular latencia de red
    await new Promise(r => setTimeout(r, 800));
    // TODO: reemplazar con: await checkinAppointment(id)
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'arrived' as const } : a))
    );
    setCheckingInId(null);
  };

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.patientDni.includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const arrivedCount = appointments.filter(a => a.status === 'arrived' || a.status === 'in-progress').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 mx-auto max-w-2xl">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Gestión de Turnos
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Presentismo</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Registro de llegada de pacientes · Jueves 10 de abril de 2026
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/5 px-3 py-2 text-xs">
            <span className="font-semibold text-amber-700">{pendingCount}</span>
            <span className="text-muted-foreground">pendientes</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
            <span className="font-semibold text-primary">{arrivedCount}</span>
            <span className="text-muted-foreground">presentes</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
            <span className="font-semibold text-foreground">{appointments.length}</span>
            <span className="text-muted-foreground">total del día</span>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o N° de turno..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>

        {/* Lista de turnos */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Search className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Sin resultados</p>
              <p className="mt-1 text-xs text-muted-foreground">Probá con otro nombre o DNI.</p>
            </div>
          ) : (
            filtered.map((appt, idx) => (
              <Card
                key={appt.id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300 border-border shadow-none transition-all',
                  appt.status === 'completed' && 'opacity-50',
                  appt.status === 'arrived' && 'border-primary/30'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                          {appt.patientName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{appt.patientName}</p>
                          <p className="text-xs text-muted-foreground">DNI {appt.patientDni}</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          'flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusConfig[appt.status].className
                        )}
                      >
                        {statusConfig[appt.status].label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 pl-12">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        {appt.time} hs · <span className="font-mono">{appt.id}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5 flex-shrink-0" />
                        {appt.doctor}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        {appt.specialty} · {appt.medicalCenter}
                      </span>
                    </div>

                    {appt.status === 'pending' && (
                      <div className="pl-12">
                        <Button
                          size="sm"
                          className="text-xs"
                          disabled={checkingInId === appt.id}
                          onClick={() => handleCheckin(appt.id)}
                        >
                          {checkingInId === appt.id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Registrando...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Registrar llegada
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
