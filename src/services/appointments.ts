import axios from 'axios';

import type {
  CancelAppointmentResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentsRequest,
  GetAppointmentsResponse,
} from '@/typings/services';
import { ENV } from '@/constants';

export const getAppointments = async (req: GetAppointmentsRequest): Promise<GetAppointmentsResponse> => {
  await new Promise(a => setTimeout(a, 50));
  try {
    const url = `${ENV.BASE_URL}/appointments`;
    const response = await axios.get<GetAppointmentsResponse>(url, { params: req });
    return response.data;
  } catch (err) {
    console.warn('ERROR ON: getAppointments');
    console.warn(err);
    return {
      appointments: [],
      pagination: {
        appointments_per_page: 0,
        total_appointments: 0,
        total_pages: 0,
      },
    } as unknown as GetAppointmentsResponse;
  }
};

export const createAppointment = async (data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> => {
  const response = await axios.post<CreateAppointmentResponse>(`${ENV.BASE_URL}/appointments`, data);
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<CancelAppointmentResponse> => {
  const response = await axios.delete<CancelAppointmentResponse>(`${ENV.BASE_URL}/appointments/${id}`);
  return response.data;
};