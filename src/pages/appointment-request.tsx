import { Fragment } from 'react';
import { Check } from 'lucide-react';

import { Appointment_Initial } from '@/modules/appointment-initial/appointment-initial';
import { Appointment_Confirmation } from '@/modules/appointment-confirmation';
import { Appointment_Success } from '@/modules/appointment-success';
import { UseAppointments } from '@/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';
import { cn } from '@/lib/utils';

export default function Page() {
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
        <TurnosStep />
      </div>
    </div>
  );
}

const TurnosStep = () => {
  const { metadata } = UseAppointments(APPOINTMENTS_STEPS.APPOINTMENT_INITIAL);
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

// El stepper solo muestra los 3 pasos visibles (el éxito no es un "paso" numerado)
const STEP_CONFIG = [
  { step: APPOINTMENTS_STEPS.APPOINTMENT_INITIAL, label: 'Preferencias' },
  { step: APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION, label: 'Confirmación' },
];

const Stepper = ({ currentStep }: { currentStep: APPOINTMENTS_STEPS }) => {
  if (currentStep === APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS) return null;

  const currentIndex = STEP_CONFIG.findIndex(s => s.step === currentStep);
  return (
    <div className="mb-6 flex items-center gap-3">
      {STEP_CONFIG.map(({ step, label }, i) => (
        <Fragment key={step}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 flex-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
                i < currentIndex
                  ? 'bg-primary text-primary-foreground'
                  : i === currentIndex
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/25 ring-offset-1 ring-offset-background'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {i < currentIndex ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden text-sm font-medium transition-colors duration-200 sm:block',
                i === currentIndex ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </div>
          {i < STEP_CONFIG.length - 1 && (
            <div
              className={cn(
                'h-px flex-1 transition-colors duration-300',
                i < currentIndex ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};
