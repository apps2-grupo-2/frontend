import type { APPOINTMENTS_STEPS } from '@/constants';
import type { AppointmentInitialFormProps } from '../modules/appointment-initial';

export type UseAppointmentsData = {
  metadata: {
    step: APPOINTMENTS_STEPS;
    payload: Payload;
    setPayload: (payload: Payload) => void;
    navigateTo: (step: APPOINTMENTS_STEPS) => void;
  };
};

export type Payload = Omit<AppointmentInitialFormProps, 'date'> & {
  appointment_id?: string;
  patient?: {
    id: number;
    fullname: string;
    email: string;
  };
};