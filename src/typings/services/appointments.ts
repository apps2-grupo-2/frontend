import type { APPOINTMENT_STATUSES } from '@/constants';
import type { Pagination } from './common';

export type GetAppointmentsRequest = {
  light_response?: number;
  medic_id?: number; // Filtrar por médico (ID de usuario)
  medical_center_id?: number; // Filtrar por centro médico (ID)
  page?: number; // Número de página (por defecto: 1)
  patient_id?: number; // Filtrar por paciente (ID de usuario)
  since: string; // Fecha y hora desde (YYYY-MM-DD HH:mm:ss)
  speciality_id?: number; // Filtrar por especialidad médica (ID)
  until: string; // Fecha y hora hasta (YYYY-MM-DD HH:mm:ss)
};

export type GetAppointmentsResponse = {
  appointments: Appointment[];
  pagination: Pagination;
};

export type Appointment = {
  id: number;
  status: (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];
  starts_at: string;
  ends_at: string;
  confirmed_at: string | null;
  absent_at: string | null;
  expired_at: string | null;
  checked_in_at: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  started_at: string | null;
  created_at: string;
  patient: {
    id: number;
    fullname: string;
    email: string;
  };
  medic: {
    id: number;
    fullname: string;
    email: string;
  };
  speciality: {
    id: number;
    name: string;
    is_high_complexity: number;
  };
  medical_center: {
    id: number;
    name: string;
  };
};

export type CreateAppointmentRequest = {
  medic: {
    id: number;
    fullname: string;
    email: string;
  };
  patient: {
    id: number;
    fullname: string;
    email: string;
  };
  appointment: {
    center_id: number;
    speciality_id: number;
    starts_at: string;
    ends_at: string;
  };
};

export type CreateAppointmentResponse = {
  appointment_id: number;
};

export type CancelAppointmentResponse = {
  message: string;
};

export type ConfirmAppointmentResponse = {
  message: string;
};

export type CheckInAppointmentResponse = {
  message: string;
};

export type StartAppointmentResponse = {
  message: string;
};

export type FinishAppointmentResponse = {
  message: string;
};

export type RescheduleAppointmentRequest = {
  starts_at: string;
  ends_at: string;
};

export type RescheduleAppointmentResponse = {
  message: string;
};