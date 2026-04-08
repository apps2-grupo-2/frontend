import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { upcomingAppointments } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Page() {
  return (
    <div>
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
          + Solicitar turno
        </Button>
      </div>
      {upcomingAppointments.map(appt => (
        <Card key={appt.id} className="border-border shadow-none">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                  {appt.modality === 'virtual' ? (
                    <Video className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  ) : (
                    <Calendar className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground sm:text-base">{appt.doctor}</p>
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">{appt.specialty}</p>
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
      ))}
    </div>
  );
};
