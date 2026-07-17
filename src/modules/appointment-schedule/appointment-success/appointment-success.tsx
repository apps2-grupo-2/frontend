import { useNavigate } from 'react-router-dom';
import { Calendar, CalendarPlus, CheckCircle, Clock, MapPin, Stethoscope, User } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import { useAppointmentLabels } from '../hooks/use-appointment-labels';

export const Appointment_Success = (props: StepProps) => {
  const { metadata } = props;
  const navigate = useNavigate();
  const { specialtyLabel, professionalLabel, medicalCenterLabel, priorityLabel, dateLabel, rangeTimeLabel } =
    useAppointmentLabels(metadata.payload);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 max-w-[600px]">
        <Card className="border-border shadow-none">
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 pb-4 text-center">
              <div className="animate-in zoom-in-50 fill-mode-both duration-400 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="animate-in zoom-in-75 fill-mode-both delay-150 duration-300 h-12 w-12 text-green-700" />
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both delay-200 duration-300">
                <h2 className="text-lg font-bold text-foreground">¡Turno solicitado!</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Queda <span className="font-medium text-amber-600">pendiente de confirmación</span>. Confirmalo desde
                  "Mis turnos". Te enviaremos un recordatorio 24 hs antes.
                </p>
              </div>
              <span className="animate-in fade-in fill-mode-both delay-300 duration-300 rounded-full bg-muted px-3 py-1 text-xs font-mono font-semibold text-muted-foreground">
                TUR-{metadata.payload.appointment_id}
              </span>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Especialidad</p>
                  <p className="text-sm font-semibold text-foreground">{specialtyLabel}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profesional</p>
                <p className="text-sm font-semibold text-foreground">{professionalLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Centro médico - ({priorityLabel})</p>
                <p className="text-sm font-semibold text-foreground">{medicalCenterLabel}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="text-sm font-semibold capitalize text-foreground">{dateLabel}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Horario</p>
                <p className="text-sm font-semibold text-foreground">{rangeTimeLabel} hs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button size="lg" onClick={() => navigate(ROUTES.TURNOS)}>
            Ver mis turnos
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = ROUTES.SOLICITAR_TURNOS)}>
            <CalendarPlus className="h-4 w-4" />
            Solicitar otro turno
          </Button>
        </div>
      </div>
    </div>
  );
};