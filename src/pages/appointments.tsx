import { Calendar, Clock, MapPin, Video, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { upcomingAppointments } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const statusConfig: Record<string, { label: string; className: string }> = {
  confirmado: { label: 'Confirmado', className: 'bg-success/10 text-success' },
  pendiente: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-600' },
  cancelado: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
};

export default function Page() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Portal del Paciente
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Turnos</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Consigue turno con un profesional o de una especialidad
        </p>
      </div>
      <AppointmentsTab />
    </div>
  );
}

const AppointmentsTab = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground sm:text-xl">Turnos Próximos</h2>
        <Button
          size="lg"
          onClick={() => navigate(ROUTES.SOLICITAR_TURNOS)}
          className="w-full bg-primary text-primary-foreground hover:bg-secondary sm:w-auto"
        >
          <CalendarPlus className="h-4 w-4" />
          Solicitar turno
        </Button>
      </div>

      {upcomingAppointments.length === 0 ? (
        <EmptyState onRequest={() => navigate(ROUTES.SOLICITAR_TURNOS)} />
      ) : (
        upcomingAppointments.map(appt => (
          <Card
            key={appt.id}
            className="border-border shadow-none transition-all duration-200 hover:border-primary/20 hover:shadow-md"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 sm:h-12 sm:w-12">
                    {appt.modality === 'virtual' ? (
                      <Video className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    ) : (
                      <Calendar className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground sm:text-base">{appt.doctor}</p>
                        <p className="truncate text-xs text-muted-foreground sm:text-sm">{appt.specialty}</p>
                      </div>
                      {statusConfig[appt.status] && (
                        <span
                          className={cn(
                            'flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                            statusConfig[appt.status].className
                          )}
                        >
                          {statusConfig[appt.status].label}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-col gap-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(appt.date)} · {appt.time} hs
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{appt.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  {appt.modality === 'virtual' && (
                    <Button
                      size="sm"
                      className="w-full bg-accent text-xs text-accent-foreground hover:bg-accent/90 sm:w-auto"
                    >
                      Unirse
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

const EmptyState = ({ onRequest }: { onRequest: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
      <Calendar className="h-7 w-7 text-muted-foreground" />
    </div>
    <p className="mt-4 font-semibold text-foreground">Sin turnos próximos</p>
    <p className="mt-1 text-sm text-muted-foreground">No tenés turnos agendados por el momento.</p>
    <Button className="mt-6" onClick={onRequest}>
      <CalendarPlus className="h-4 w-4" />
      Solicitar turno
    </Button>
  </div>
);
