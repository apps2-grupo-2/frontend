import type { Pagination } from './common';

export type AppointmentsRequest = {
  medic_id?: number; // Filtrar por médico (ID de usuario)
  medical_center_id?: number; // Filtrar por centro médico (ID)
  page?: number; // Número de página (por defecto: 1)
  patient_id?: number; // Filtrar por paciente (ID de usuario)
  since: string; // Fecha y hora desde (YYYY-MM-DD HH:mm:ss)
  speciality_id?: number; // Filtrar por especialidad médica (ID)
  until: string; // Fecha y hora hasta (YYYY-MM-DD HH:mm:ss)
};

export type AppointmentsResponse = {
  appointments: Appointment[];
  pagination: Pagination;
};

export type Appointment = {
  id: 2;
  medic_id: 1;
  patient_id: 1;
  center_id: 1;
  speciality_id: 1;
  status: 'CHECKED_IN';
  starts_at: '2026-04-11 01:22:00';
  ends_at: '2026-04-11 02:22:00';
  confirmed_at: '2026-04-14 07:14:02';
  checked_in_at: '2026-04-14 07:14:27';
  cancelled_at: null;
  completed_at: null;
  created_at: '2026-04-10 03:56:48';
};