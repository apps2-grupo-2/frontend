import { useState } from 'react';

import type { Payload, UseAppointmentsData } from '@/typings/hooks/use-appointments';
import { APPOINTMENTS_STEPS } from '@/constants';

const payloadDefault: Payload = {
  professional_id: '',
  speciality_id: '',
  priority: '',
  medical_center_id: '',
  starts_at: '',
};

export const useAppointments = (defaultStep = APPOINTMENTS_STEPS.APPOINTMENT_INITIAL): UseAppointmentsData => {
  const [payload, setPayload] = useState<Payload>(payloadDefault);
  const [step, setStep] = useState<APPOINTMENTS_STEPS>(defaultStep);

  const navigateTo = (step: APPOINTMENTS_STEPS) => {
    setStep(step);
  };

  return {
    metadata: {
      step,
      payload,
      setPayload,
      navigateTo,
    },
  };
};