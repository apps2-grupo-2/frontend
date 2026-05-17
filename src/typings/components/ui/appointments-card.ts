import type { APPOINTMENT_STATUSES } from '@/constants';

export type EmptyStateProps = {
  onRequest: () => void;
};

export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  modality: string;
  status: (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];
};

export type AppointmentCardProps = {
  appointment: Appointment;
  isLoading: boolean;
  onCancel: () => void;
  onReschedule: () => void;
};