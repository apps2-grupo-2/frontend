import { Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { StepNavigation } from '@/components/ui/step-navigation';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENTS_STEPS } from '@/constants';

export const Appointment_Confirmation = (props: StepProps) => {
  const { metadata } = props;
  const payload = metadata.payload;

  // TODO: cuando se integre con el backend real, estos labels
  // vendrán directamente en la respuesta de GET /appointments/preview
  const specialtyLabel = 'Clinica Médica';
  const professionalLabel = 'Jose Montes';
  const centerLabel = 'Centro de Salud German Urquiza';
  const priorityLabel = 'Turno más próximo';
  const dateLabel = 'Turno más próximo';
  const rangeTimeLabel = '9:00 hs';

  const backHandler = () => {
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  };

  const onSubmit = () => {
    // TODO: reemplazar con POST /appointments (endpoint propio del módulo)
    // Body: { professionalId, specialtyId, centerId, priority, date, time }
    // Respuesta esperada: { id: 'TUR-XXXX', ... }
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS);
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} id="form">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Revisá los datos antes de confirmar el turno.</p>

          <Card className="border-border shadow-none max-w-[600px]">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Especialidad</p>
                  <p className="text-sm font-semibold text-foreground">{specialtyLabel}</p>
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
                  <p className="text-xs text-muted-foreground">Centro médico · {priorityLabel}</p>
                  <p className="text-sm font-semibold text-foreground">{centerLabel}</p>
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
                  <p className="text-sm font-semibold text-foreground">{rangeTimeLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
      <StepNavigation backBtn={{ onClick: backHandler }} />
    </div>
  );
};
