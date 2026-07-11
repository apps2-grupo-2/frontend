import { addDays, addHours, format } from 'date-fns';

import type {
  Appointment,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentsRequest,
  GetAppointmentsResponse,
} from '@/typings/services';
import { APPOINTMENT_STATUSES } from '@/constants';

/**
 * Mock en memoria de turnos para poder probar las 4 funcionalidades sin backend:
 *   1. Orden de turnos (Finalizado al final) en el listado del administrativo.
 *   2. Lat/lng random al loguearse (no depende de estos datos).
 *   3. Listado de turnos del profesional sin DNI.
 *   4. Botón "Confirmar turno" del paciente con la ventana de hasta 24hs antes.
 *
 * Se activa con ENV.USE_MOCKS = true.
 */

const fmt = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');

const SPECIALITIES = [
  { id: 1, name: 'Cardiología', is_high_complexity: 1 },
  { id: 2, name: 'Clínica Médica', is_high_complexity: 0 },
  { id: 3, name: 'Dermatología', is_high_complexity: 0 },
];

const MEDICAL_CENTERS = [
  { id: 1, name: 'Centro Médico Norte' },
  { id: 2, name: 'Centro Médico Centro' },
];

const MEDIC = { id: 2, fullname: 'Fernandez Juan Pablo', email: 'jfernandez@healthgrid.com' };

// Paciente principal (coincide con el acceso rápido "Paciente" → id 4).
const PATIENT = { id: 4, fullname: 'López Martín Andrés', email: 'martin.lopez@email.com' };

const baseAppointment = (
  overrides: Partial<Appointment> & Pick<Appointment, 'id' | 'status' | 'starts_at'>
): Appointment => ({
  ends_at: fmt(addHours(new Date(overrides.starts_at.replace(' ', 'T')), 1)),
  confirmed_at: null,
  absent_at: null,
  expired_at: null,
  checked_in_at: null,
  cancelled_at: null,
  completed_at: null,
  started_at: null,
  created_at: fmt(addDays(new Date(), -10)),
  patient: PATIENT,
  medic: MEDIC,
  speciality: SPECIALITIES[0],
  medical_center: MEDICAL_CENTERS[0],
  ...overrides,
});

// Semilla relativa a "ahora" para que los turnos siempre caigan en la ventana hoy..+30d.
const seedAppointments = (): Appointment[] => {
  const now = new Date();
  return [
    // Finalizado hoy → debe quedar al final en el listado del administrativo (tarea 1).
    baseAppointment({
      id: 1,
      status: APPOINTMENT_STATUSES.COMPLETED,
      starts_at: fmt(addHours(now, 2)),
      completed_at: fmt(now),
      speciality: SPECIALITIES[1],
    }),
    // Pendiente a <24hs → botón confirmar DESHABILITADO (tarea 4).
    baseAppointment({
      id: 2,
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      starts_at: fmt(addHours(now, 6)),
    }),
    // Confirmado a futuro.
    baseAppointment({
      id: 3,
      status: APPOINTMENT_STATUSES.CONFIRMED,
      starts_at: fmt(addDays(now, 2)),
      confirmed_at: fmt(now),
      speciality: SPECIALITIES[2],
      medical_center: MEDICAL_CENTERS[1],
    }),
    // Pendiente a >24hs → botón confirmar HABILITADO (tarea 4).
    baseAppointment({
      id: 4,
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      starts_at: fmt(addDays(now, 3)),
    }),
    // Otro Finalizado → también debe ir al final (tarea 1).
    baseAppointment({
      id: 5,
      status: APPOINTMENT_STATUSES.COMPLETED,
      starts_at: fmt(addDays(now, 5)),
      completed_at: fmt(now),
      speciality: SPECIALITIES[1],
    }),
    // Cancelado a futuro.
    baseAppointment({
      id: 6,
      status: APPOINTMENT_STATUSES.CANCELLED,
      starts_at: fmt(addDays(now, 7)),
      cancelled_at: fmt(now),
    }),
  ];
};

// Store mutable: confirmar/cancelar persisten durante la sesión.
let store: Appointment[] = seedAppointments();

export const resetMockAppointments = () => {
  store = seedAppointments();
};

const PER_PAGE = 10;

const inRange = (a: Appointment, since?: string, until?: string) => {
  const t = new Date(a.starts_at.replace(' ', 'T')).getTime();
  const okSince = since ? t >= new Date(since.replace(' ', 'T')).getTime() : true;
  const okUntil = until ? t <= new Date(until.replace(' ', 'T')).getTime() : true;
  return okSince && okUntil;
};

// Genera turnos sobre la grilla de medias horas (09:00-18:00) del día consultado,
// usados por el dashboard del profesional (matchea por starts_at exacto).
const buildMedicDay = (since: string, medicId: number): Appointment[] => {
  const day = since.split(' ')[0];
  const patients = [
    { id: 5, fullname: 'Fernández Lucía Soledad', email: 'lucia.fernandez@email.com' },
    { id: 6, fullname: 'Pérez Juan Ignacio', email: 'juan.perez@email.com' },
    { id: 7, fullname: 'Rodríguez Carolina Beatriz', email: 'carolina.rodriguez@email.com' },
  ];
  const rows: Array<{ time: string; status: Appointment['status'] }> = [
    { time: '09:00:00', status: APPOINTMENT_STATUSES.CONFIRMED },
    { time: '10:30:00', status: APPOINTMENT_STATUSES.CHECKED_IN },
    { time: '14:00:00', status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION },
  ];
  return rows.map((r, idx) =>
    baseAppointment({
      id: 9000 + idx,
      status: r.status,
      starts_at: `${day} ${r.time}`,
      patient: patients[idx],
      medic: { ...MEDIC, id: medicId },
    })
  );
};

const paginate = (items: Appointment[], page = 1): GetAppointmentsResponse => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  return {
    appointments: items.slice(start, start + PER_PAGE),
    pagination: {
      appointments_per_page: PER_PAGE,
      total_appointments: total,
      total_pages: totalPages,
    },
  };
};

export const mockGetAppointments = async (req: GetAppointmentsRequest): Promise<GetAppointmentsResponse> => {
  await new Promise(r => setTimeout(r, 80));

  // Listado del profesional (dashboard por médico y día).
  if (req.medic_id) {
    const items = buildMedicDay(req.since, req.medic_id);
    return paginate(items, req.page);
  }

  // Listado del paciente / administrativo (por paciente y rango de fechas).
  let items = store.filter(a => inRange(a, req.since, req.until));
  if (req.patient_id) {
    // Para demo: cualquier paciente consultado ve el set principal.
    items = items.map(a => ({ ...a, patient: { ...a.patient, id: req.patient_id as number } }));
  }
  return paginate(items, req.page);
};

export const mockConfirmAppointment = async (id: number) => {
  await new Promise(r => setTimeout(r, 80));
  const appt = store.find(a => a.id === id);
  if (appt) {
    appt.status = APPOINTMENT_STATUSES.CONFIRMED;
    appt.confirmed_at = fmt(new Date());
  }
  return { message: 'confirmed' };
};

export const mockCancelAppointment = async (id: number) => {
  await new Promise(r => setTimeout(r, 80));
  const appt = store.find(a => a.id === id);
  if (appt) {
    appt.status = APPOINTMENT_STATUSES.CANCELLED;
    appt.cancelled_at = fmt(new Date());
  }
  return { message: 'cancelled' };
};

export const mockCheckInAppointment = async (id: number) => {
  await new Promise(r => setTimeout(r, 80));
  const appt = store.find(a => a.id === id);
  if (appt) {
    appt.status = APPOINTMENT_STATUSES.CHECKED_IN;
    appt.checked_in_at = fmt(new Date());
  }
  return { message: 'checked-in' };
};

// Crea un turno en memoria a partir del request del wizard y lo agrega al store,
// de modo que aparezca luego en los listados mockeados.
export const mockCreateAppointment = async (data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {
  await new Promise(r => setTimeout(r, 120));
  const nextId = store.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const matchedSpeciality = SPECIALITIES.find(s => s.id === data.appointment.speciality_id) ?? SPECIALITIES[0];
  store.push(
    baseAppointment({
      id: nextId,
      status: APPOINTMENT_STATUSES.PENDING_CONFIRMATION,
      starts_at: data.appointment.starts_at,
      ends_at: data.appointment.ends_at,
      patient: data.patient,
      medic: data.medic,
      speciality: { ...matchedSpeciality, id: data.appointment.speciality_id },
      medical_center: {
        id: data.appointment.center_id,
        name: MEDICAL_CENTERS.find(c => c.id === data.appointment.center_id)?.name ?? 'Centro Médico',
      },
    })
  );
  return { appointment_id: nextId };
};