import type { APPOINTMENT_STATUSES } from '@/constants';

export type WeekdaySelectorProps = {
  selectedDay: Date;
  onSelectDay: (date: Date) => void;
};

export type GetDayAppointmentsResponse = {
  id: number;
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