import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';

export type StepProps = UseAppointmentsData;

export type AppointmentCalendarFormProps = {
  priority: 'proximity' | 'availability';
  // professional: string;
};
