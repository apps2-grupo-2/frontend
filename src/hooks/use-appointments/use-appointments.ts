import { useRef, useState } from 'react';

import type { Metadata, Payload, UseAppointmentsData } from '@/typings/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';

export const UseAppointments = (defaultStep = APPOINTMENTS_STEPS.APPOINTMENT_INITIAL): UseAppointmentsData => {
  const [screen, setScreen] = useState<Metadata>({
    previousStep: defaultStep,
    step: defaultStep,
  });

  const payloadRef = useRef<Payload>(null);

  const goBack = () => {
    setScreen({ previousStep: screen.step, step: screen.previousStep });
  };

  const navigateTo = (step: APPOINTMENTS_STEPS) => {
    setScreen({ previousStep: screen.step, step });
  };

  return {
    metadata: {
      screen,
      payloadRef,
      navigateTo,
      goBack,
    },
  };
};
