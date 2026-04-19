import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';
import { Appointment_Initial } from '@/modules/appointment-initial/appointment-initial';
import { Appointment_Confirmation } from '@/modules/appointment-confirmation';
import { Appointment_Success } from '@/modules/appointment-success';
import { UseAppointments } from '@/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';
import { Stepper } from '@/modules/components/stepper';

export default function Page() {
  const { metadata } = UseAppointments(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
  const { step } = metadata.screen;
  return (
    <div className="flex animate-in flex-col duration-300 fill-mode-both fade-in slide-in-from-bottom-2">
      <div className="mb-6 sm:mb-8">
        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase sm:text-sm">
          Portal del Paciente
        </p>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">Solicitar turno</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">Consigue turno a partir de una especialidad</p>
      </div>
      <div className="animate-in duration-200 fill-mode-both fade-in">
        <Stepper currentStep={step} />
        <TurnosStep metadata={metadata} />
      </div>
    </div>
  );
}

const TurnosStep = (props: { metadata: UseAppointmentsData['metadata'] }) => {
  const { metadata } = props;
  const { step } = metadata.screen;

  if (step === APPOINTMENTS_STEPS.APPOINTMENT_INITIAL) {
    return <Appointment_Initial metadata={metadata} />;
  }
  if (step === APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION) {
    return <Appointment_Confirmation metadata={metadata} />;
  }
  if (step === APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS) {
    return <Appointment_Success metadata={metadata} />;
  }
};
