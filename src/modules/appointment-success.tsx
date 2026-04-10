import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, CalendarPlus } from 'lucide-react';

import type { StepProps } from '@/typings/modules/appointment-confirmation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants';
import {
  MOCK_SPECIALTIES,
  MOCK_MEDICAL_CENTERS,
  MOCK_MEDICAL_CENTERS_AVAILABILITY,
} from '@/mocks/appointments-mock';

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const Appointment_Success = (props: StepProps) => {
  const { metadata } = props;
  const navigate = useNavigate();
  // TODO: este ID vendrá de la respuesta del POST /appointments
  const [appointmentId] = useState(
    `TUR-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const payload = metadata.payloadRef.current;
  const initial = payload?.appointment_initial;
  const calendar = payload?.appointment_calendar;

  const allCenters = [...MOCK_MEDICAL_CENTERS, ...MOCK_MEDICAL_CENTERS_AVAILABILITY];
  const specialtyLabel = MOCK_SPECIALTIES.find(s => s.value === initial?.speciality)?.label ?? '—';
  const centerLabel = allCenters.find(c => c.value === initial?.medicalCenter)?.label ?? '—';

  return (
    <div className="flex max-w-[500px] flex-col gap-6">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">¡Turno confirmado!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recibirás un recordatorio 24 hs antes de tu turno.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-mono font-semibold text-muted-foreground">
          {appointmentId}
        </span>
      </div>

      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-semibold capitalize text-foreground">
                {calendar?.selectedDate ? formatDate(calendar.selectedDate) : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Horario</p>
              <p className="text-sm font-semibold text-foreground">
                {calendar?.selectedTime ? `${calendar.selectedTime} hs` : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
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
