import { useState } from 'react';

import type { Metadata, Payload, UseAppointmentsData } from '@/typings/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';

export const UseAppointments = (defaultStep = APPOINTMENTS_STEPS.APPOINTMENT_INITIAL): UseAppointmentsData => {
  const [payload, setPayload] = useState<Payload>({
    professional: 'p2',
    speciality: '307',
    priority: 'availability',
    medicalCenter: '6',
    date: '2026-04-22T03:00:00.000Z',
    rangeTime: 'a2',
  });
  const [screen, setScreen] = useState<Metadata>({
    previousStep: defaultStep,
    step: defaultStep,
  });

  const goBack = () => {
    setScreen({ previousStep: screen.step, step: screen.previousStep });
  };

  const navigateTo = (step: APPOINTMENTS_STEPS) => {
    setScreen({ previousStep: screen.step, step });
  };

  return {
    metadata: {
      screen,
      payload,
      setPayload,
      navigateTo,
      goBack,
    },
  };
};
