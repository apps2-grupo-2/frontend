import type { AppointmentInitialFormProps } from '@/typings/modules/appointment-initial';
import type { APPOINTMENTS_STEPS } from '@/constants';

export type Metadata = {
  previousStep: APPOINTMENTS_STEPS;
  step: APPOINTMENTS_STEPS;
};

export type UseAppointmentsData = {
  metadata: {
    screen: Metadata;
    payload: Payload;
    setPayload: (payload: Payload) => void;
    navigateTo: (step: APPOINTMENTS_STEPS) => void;
    goBack: () => void;
  };
};

export type Payload =
  | null
  | (Omit<AppointmentInitialFormProps, 'date'> & {
      date: string;
    });
