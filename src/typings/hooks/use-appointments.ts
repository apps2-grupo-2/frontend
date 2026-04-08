import type { RefObject } from 'react';

import type { AppointmentInitialFormProps } from '@/typings/modules/appointment-initial';
import type { APPOINTMENTS_STEPS } from '@/constants';

export type Metadata = {
  previousStep: APPOINTMENTS_STEPS;
  step: APPOINTMENTS_STEPS;
};

export type UseAppointmentsData = {
  metadata: {
    screen: Metadata;
    payloadRef: RefObject<Payload>;
    navigateTo: (step: APPOINTMENTS_STEPS) => void;
    goBack: () => void;
  };
};

export type Payload = {
  appointment_initial: AppointmentInitialFormProps;
} | null;
