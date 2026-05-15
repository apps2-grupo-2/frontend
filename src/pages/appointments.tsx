import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { CalendarPlus } from 'lucide-react';

import type { Appointment } from '@/typings/components/ui/appointments-card';
import type { AppointmentsRequest } from '@/typings/services';
import { AppointmentCard, EmptyState } from '@/components/ui/appointments-card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { useGetAppointments } from '@/hooks/use-appointments-data';

export default function Page() {
  return (
    <div className="animate-in duration-300 fill-mode-both fade-in slide-in-from-bottom-2">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Portal del Paciente
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Turnos</h1>
      </div>
      <Appointments />
    </div>
  );
}

const apptExample = {
  id: 'TUR-8821',
  doctor: 'Dr. Carlos Peralta',
  specialty: 'Cardiología',
  date: '2026-03-24',
  time: '09:30',
  location: 'Consultorio 4B',
  modality: 'presencial',
  status: 'confirmado',
};

const appointmentsDefaultParams: AppointmentsRequest = {
  since: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  until: format(addDays(new Date(), 30), 'yyyy-MM-dd HH:mm:ss'), // Próximos 30 días
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointmentsParams, setAppointmentsParams] = useState<AppointmentsRequest>(appointmentsDefaultParams);
  const [patientId, setPatientId] = useState<number>(2);
  const { data: appointments, isLoading: isLoadingAppointments } = useGetAppointments(appointmentsParams, !!patientId);

  console.warn('appointments');
  console.warn(appointments);

  // Estado local para manejar cancelaciones sin backend
  // TODO: reemplazar con mutación al endpoint DELETE /appointments/:id
  //const [appointments, setAppointments] = useState<Appointment[]>(upcomingAppointments as Appointment[]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    // TODO: llamar a DELETE /appointments/:id o PATCH /appointments/:id { status: 'cancelado' }
    //setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: 'cancelado' } : a)));
    setCancellingId(null);
  };

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

      {appointments?.length === 0 ? (
        <EmptyState onRequest={() => navigate(ROUTES.SOLICITAR_TURNOS)} />
      ) : (
        appointments?.map((appt, idx) => (
          <b key={appt.id}>hola</b>
          // <AppointmentCard
          //   key={appt.id}
          //   appointment={appt}
          //   index={idx}
          //   isCancelling={cancellingId === appt.id}
          //   onCancel={() => handleCancel(appt.id)}
          //   onCancelRequest={() => setCancellingId(appt.id)}
          //   onCancelDismiss={() => setCancellingId(null)}
          //   onReschedule={() => navigate(ROUTES.SOLICITAR_TURNOS)}
          // />
        ))
      )}
      <AppointmentCard
        index={2}
        appointment={apptExample}
        isCancelling={false}
        onCancel={() => {}}
        onCancelRequest={() => {}}
        onCancelDismiss={() => {}}
        onReschedule={() => {}}
      />
    </div>
  );
};