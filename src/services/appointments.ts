import axios from 'axios';

import type {
  Appointment,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentsRequest,
  GetAppointmentsResponse,
} from '@/typings/services';
import { ENV } from '@/constants';

export const getAppointments = async (req: GetAppointmentsRequest): Promise<Appointment[]> => {
  await new Promise(a => setTimeout(a, 50));
  try {
    const url = `${ENV.BASE_URL}/appointments`;
    const response = await axios.get<GetAppointmentsResponse>(url, { params: req });
    return response.data.appointments;
  } catch (err) {
    console.warn('ERROR ON: getAppointments');
    console.warn(err);
    return [] as unknown as Appointment[]; // Retorna un array vacío en caso de error para evitar que la app se rompa. Idealmente, manejar este error de forma más robusta (ej: mostrar mensaje al usuario).
  }
};

export const createAppointment = async (data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {
  const response = await axios.post<CreateAppointmentResponse>(`${ENV.BASE_URL}/appointments`, data);
  return response.data;
};