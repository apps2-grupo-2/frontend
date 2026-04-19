import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, CalendarPlus } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';

const appointmentId = `TUR-${Math.floor(1000 + Math.random() * 9000)}`;

export const Appointment_Success = (props: StepProps) => {
  const { metadata } = props;
  const navigate = useNavigate();
  // TODO: este ID vendrá de la respuesta del POST /appointments

  const specialtyLabel = 'Clinica Médica';
  const centerLabel = 'Centro de Salud German Urquiza';
  const dateLabel = '24/05/2026';
  const rangeTimeLabel = '9:00 hs';

  return (
    <div className="flex flex-col gap-6 max-w-[650px]">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="animate-in zoom-in-50 fill-mode-both duration-400 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="animate-in zoom-in-75 fill-mode-both delay-150 duration-300 h-12 w-12 text-green-700" />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both delay-200 duration-300">
          <h2 className="text-lg font-bold text-foreground">¡Turno confirmado!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Recibirás un recordatorio 24 hs antes de tu turno.</p>
        </div>
        <span className="animate-in fade-in fill-mode-both delay-300 duration-300 rounded-full bg-muted px-3 py-1 text-xs font-mono font-semibold text-muted-foreground">
          {appointmentId}
        </span>
      </div>

      <Card className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both delay-350 duration-300 border-border shadow-none">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4  text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-semibold capitalize text-foreground">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4  text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Horario</p>
              <p className="text-sm font-semibold text-foreground">{rangeTimeLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4  text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Centro médico · {specialtyLabel}</p>
              <p className="text-sm font-semibold text-foreground">{centerLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button size="lg" onClick={() => navigate(ROUTES.TURNOS)}>
          Ver mis turnos
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => metadata.navigateTo(0)} // APPOINTMENT_INITIAL = 0
        >
          <CalendarPlus className="h-4 w-4" />
          Solicitar otro turno
        </Button>
      </div>
    </div>
  );
};
