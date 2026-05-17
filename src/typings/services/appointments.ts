import type { Pagination } from './common';

export type GetAppointmentsRequest = {
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
  medic_id: number;
  patient_id: number;
  center_id: number;
  speciality_id: number;
  status: string;
  starts_at: string;
  ends_at: string;
  confirmed_at: string | null;
  checked_in_at: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  created_at: string;
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