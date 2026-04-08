import { Appointment_Initial } from '@/modules/appointment-initial';
import { Appointment_Calendar } from '@/modules/appointment-calendar';
import { UseAppointments } from '@/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Portal del Paciente
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Solicitar turno</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Consigue turno con un profesional o de una especialidad
        </p>
      </div>
      <TurnosStep />
    </div>
  );
}

const TurnosStep = () => {
  const { metadata } = UseAppointments(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  const { step } = metadata.screen;

  if (step === APPOINTMENTS_STEPS.APPOINTMENT_INITIAL) {
    return <Appointment_Initial metadata={metadata} />;
  }
  if (step === APPOINTMENTS_STEPS.APPOINTMENT_CALENDAR) {
    return <Appointment_Calendar metadata={metadata} />;
  }

  return <></>;
};
