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
  status: string;
};

export type AppointmentCardProps = {
  appointment: Appointment;
  index: number;
  isCancelling: boolean;
  onCancel: () => void;
  onCancelRequest: () => void;
  onCancelDismiss: () => void;
  onReschedule: () => void;
};