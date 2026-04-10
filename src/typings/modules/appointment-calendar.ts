import type { UseAppointmentsData } from '@/typings/hooks/use-appointments';

export type StepProps = UseAppointmentsData;

export type AppointmentCalendarFormProps = {
  selectedDate: string; // 'YYYY-MM-DD'
  selectedTime: string; // 'HH:MM'
};
