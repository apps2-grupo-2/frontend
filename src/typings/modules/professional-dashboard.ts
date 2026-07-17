import type { APPOINTMENT_STATUSES } from '@/constants';

export type WeekdaySelectorProps = {
  selectedDay: Date;
  onSelectDay: (date: Date) => void;
};

export type GetDayAppointmentsResponse = {
  id: number;
  // Id real del turno (appointment.id) para las acciones y el label TUR-.
  // Es null en los slots libres. NO confundir con `id`, que es el índice del slot.
  appointmentId: number | null;
  starts_at: string;
  status: (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES] | 'available';
  patient: {
    id: number;
    fullname: string;
    dni: string;
  };
};

export type SlotCardProps = {
  slot: GetDayAppointmentsResponse;
  onConfirm: (id: number) => void;
};