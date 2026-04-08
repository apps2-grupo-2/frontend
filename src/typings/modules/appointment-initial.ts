import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';
import type { APPOINTMENT_TYPES, PRIORITY_TYPES } from '@/constants';

export type StepProps = UseAppointmentsData;

export type AppointmentInitialFormProps = {
  appointmentType: (typeof APPOINTMENT_TYPES)[keyof typeof APPOINTMENT_TYPES];
  professional: string;
  speciality: string;
  priority: (typeof PRIORITY_TYPES)[keyof typeof PRIORITY_TYPES] | '';
  medicalCenter: string;
};
