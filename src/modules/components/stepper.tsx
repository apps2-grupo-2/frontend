import { Fragment } from 'react';
import { Check } from 'lucide-react';

import { APPOINTMENTS_STEPS } from '@/constants';
import { cn } from '@/lib/utils';

const STEP_CONFIG = [
  { step: APPOINTMENTS_STEPS.APPOINTMENT_INITIAL, label: 'Preferencias' },
  { step: APPOINTMENTS_STEPS.APPOINTMENT_CONFIRMATION, label: 'Fecha y hora' },
  { step: APPOINTMENTS_STEPS.APPOINTMENT_SUCCESS, label: 'Confirmación' },
];

export const Stepper = ({ currentStep }: { currentStep: APPOINTMENTS_STEPS }) => {
  const currentIndex = STEP_CONFIG.findIndex(s => s.step === currentStep);
  return (
    <div className="mb-6 flex max-w-[650px] items-center gap-3">
      {STEP_CONFIG.map(({ step, label }, i) => (
        <Fragment key={step}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
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
