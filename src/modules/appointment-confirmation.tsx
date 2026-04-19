import { Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { StepNavigation } from '@/components/ui/step-navigation';
import { APPOINTMENTS_STEPS, APPOINTMENT_TYPES } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import {
  MOCK_SPECIALTIES,
  MOCK_PROFESSIONALS,
  MOCK_MEDICAL_CENTERS,
  MOCK_MEDICAL_CENTERS_AVAILABILITY,
} from '@/mocks/appointments-mock';

const PRIORITY_LABELS: Record<string, string> = {
  proximity: 'Por cercanía',
  availability: 'Por primera disponibilidad',
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const Appointment_Confirmation = (props: StepProps) => {
  const { metadata } = props;
  const payload = metadata.payloadRef.current;
  const initial = payload?.appointment_initial;
  const calendar = payload?.appointment_calendar;

  // TODO: cuando se integre con el backend real, estos labels
  // vendrán directamente en la respuesta de GET /appointments/preview
  const allCenters = [...MOCK_MEDICAL_CENTERS, ...MOCK_MEDICAL_CENTERS_AVAILABILITY];
  const specialtyLabel = MOCK_SPECIALTIES.find(s => s.value === initial?.speciality)?.label ?? '—';
  const professionalLabel = initial?.professional
    ? MOCK_PROFESSIONALS.find(p => p.value === initial.professional)?.label
    : undefined;
  const centerLabel = allCenters.find(c => c.value === initial?.medicalCenter)?.label ?? '—';
  const priorityLabel = initial?.priority ? (PRIORITY_LABELS[initial.priority] ?? '—') : '—';

  const backHandler = () => {
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_CALENDAR);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: reemplazar con POST /appointments (endpoint propio del módulo)
    // Body: { professionalId, specialtyId, centerId, priority, date, time }
    // Respuesta esperada: { id: 'TUR-XXXX', ... }
    metadata.navigateTo(APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS);
  };

  return (
    <div>
      <form onSubmit={onSubmit} id="form" className="mb-4">
        <div className="flex max-w-[500px] flex-col gap-4">
          <p className="text-sm text-muted-foreground">Revisá los datos antes de confirmar el turno.</p>

          <Card className="border-border shadow-none">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Especialidad</p>
                  <p className="text-sm font-semibold text-foreground">{specialtyLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profesional</p>
                  <p className="text-sm font-semibold text-foreground">{professionalLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Centro médico · {priorityLabel}</p>
                  <p className="text-sm font-semibold text-foreground">{centerLabel}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm font-semibold capitalize text-foreground">
                      {calendar?.selectedDate ? formatDate(calendar.selectedDate) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horario</p>
                  <p className="text-sm font-semibold text-foreground">
                    {calendar?.selectedTime ? `${calendar.selectedTime} hs` : '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <StepNavigation backBtn={{ onClick: backHandler }} nextBtn={{ disabled: false }} />
    </div>
  );
};
