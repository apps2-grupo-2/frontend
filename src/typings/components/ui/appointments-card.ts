import type { Appointment } from '@/typings/services';

export type AppointmentCardProps = {
  appointment: Appointment;
  isLoading: boolean;
  onCancel: (id: number) => void;
  onConfirm: (id: number) => void;
  onReschedule: () => void;
};

export type EmptyStateProps = {
  onRequest: () => void;
};